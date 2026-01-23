import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fc from 'fast-check';
import { AdminAuthProvider, useAdminAuth } from '../../../context/AdminAuthContext';

// Test component to access auth context
const TestComponent = ({ onAuthChange }) => {
  const auth = useAdminAuth();
  
  React.useEffect(() => {
    if (onAuthChange) {
      onAuthChange(auth);
    }
  }, [auth, onAuthChange]);

  return (
    <div>
      <div data-testid="auth-status">
        {auth.isAdminAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      <div data-testid="user-info">
        {auth.adminUser ? JSON.stringify(auth.adminUser) : 'no-user'}
      </div>
    </div>
  );
};

const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <AdminAuthProvider>
        {component}
      </AdminAuthProvider>
    </MemoryRouter>
  );
};

describe('Admin Authentication Property Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  /**
   * Property 1: Admin Access Control
   * For any admin access attempt, only valid credentials should grant access to the admin panel
   * Validates: Requirements 1.1
   */
  test('Property 1: Admin Access Control - Feature: comprehensive-admin-panel, Property 1: Admin access control', async () => {
    const validCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'staff', password: 'staff123' }
    ];

    // Test with valid credentials
    for (const credentials of validCredentials) {
      let authResult = null;
      
      const TestWrapper = () => {
        const auth = useAdminAuth();
        
        React.useEffect(() => {
          const testLogin = async () => {
            const result = await auth.adminLogin(credentials);
            authResult = result;
          };
          testLogin();
        }, [auth]);

        return <div data-testid="test">Test</div>;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authResult).not.toBeNull();
        }, { timeout: 1000 });
      });

      expect(authResult.success).toBe(true);
      expect(authResult.user).toBeDefined();
    }

    // Test with invalid credentials
    const invalidCredentials = [
      { username: 'invalid', password: 'invalid' },
      { username: 'admin', password: 'wrong' },
      { username: 'wrong', password: 'admin123' }
    ];

    for (const credentials of invalidCredentials) {
      let authResult = null;
      
      const TestWrapper = () => {
        const auth = useAdminAuth();
        
        React.useEffect(() => {
          const testLogin = async () => {
            const result = await auth.adminLogin(credentials);
            authResult = result;
          };
          testLogin();
        }, [auth]);

        return <div data-testid="test">Test</div>;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authResult).not.toBeNull();
        }, { timeout: 1000 });
      });

      expect(authResult.success).toBe(false);
      expect(authResult.user).toBeUndefined();
    }
  });

  /**
   * Property 3: Valid Credential Access
   * For any valid admin credentials, the system should grant access and redirect to the admin dashboard
   * Validates: Requirements 1.3
   */
  test('Property 3: Valid Credential Access - Feature: comprehensive-admin-panel, Property 3: Valid credential access', async () => {
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'super-admin' },
      { username: 'manager', password: 'manager123', role: 'manager' },
      { username: 'staff', password: 'staff123', role: 'staff' }
    ];

    for (const credentials of validCredentials) {
      let authResult = null;

      const TestWrapper = () => {
        const auth = useAdminAuth();
        
        React.useEffect(() => {
          const testLogin = async () => {
            const result = await auth.adminLogin(credentials);
            authResult = result;
          };
          testLogin();
        }, [auth]);

        return <div data-testid="test">Test</div>;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authResult).not.toBeNull();
        }, { timeout: 1000 });
      });

      // Valid credentials should grant access
      expect(authResult.success).toBe(true);
      expect(authResult.user).toBeDefined();
      expect(authResult.user.username).toBe(credentials.username);
      expect(authResult.user.role).toBe(credentials.role);
      
      // Should have proper user data structure
      expect(authResult.user.id).toBeDefined();
      expect(authResult.user.email).toBeDefined();
      expect(authResult.user.loginTime).toBeDefined();
      expect(authResult.user.permissions).toBeDefined();
    }
  });

  /**
   * Property 5: Session Persistence
   * For any active admin session, browser refresh should maintain the session state without requiring re-authentication
   * Validates: Requirements 1.5
   */
  test('Property 5: Session Persistence - Feature: comprehensive-admin-panel, Property 5: Session persistence', async () => {
    const credentials = { username: 'admin', password: 'admin123' };
    
    // First, establish a session
    let initialAuthState = null;
    
    const InitialTestWrapper = () => {
      const auth = useAdminAuth();
      
      React.useEffect(() => {
        const testLogin = async () => {
          await auth.adminLogin(credentials);
          initialAuthState = auth;
        };
        testLogin();
      }, [auth]);

      return <TestComponent onAuthChange={(auth) => { initialAuthState = auth; }} />;
    };

    await act(async () => {
      renderWithProviders(<InitialTestWrapper />);
      await waitFor(() => {
        expect(initialAuthState?.isAdminAuthenticated).toBe(true);
      }, { timeout: 1000 });
    });

    // Verify session data is stored
    expect(localStorage.getItem('adminToken')).toBeTruthy();
    expect(localStorage.getItem('adminUser')).toBeTruthy();
    expect(localStorage.getItem('adminSessionExpiry')).toBeTruthy();

    // Now simulate a page refresh by creating a new provider instance
    let refreshedAuthState = null;
    
    const RefreshedTestWrapper = () => {
      return <TestComponent onAuthChange={(auth) => { refreshedAuthState = auth; }} />;
    };

    await act(async () => {
      renderWithProviders(<RefreshedTestWrapper />);
      await waitFor(() => {
        expect(refreshedAuthState).not.toBeNull();
      }, { timeout: 1000 });
    });

    // Session should be maintained after refresh
    expect(refreshedAuthState.isAdminAuthenticated).toBe(true);
    expect(refreshedAuthState.adminUser).toBeDefined();
    expect(refreshedAuthState.adminUser.username).toBe(credentials.username);
  });

  // Additional unit tests for specific scenarios
  describe('Unit Tests for Authentication Edge Cases', () => {
    test('should reject empty credentials', async () => {
      let authResult = null;
      
      const TestWrapper = () => {
        const auth = useAdminAuth();
        
        React.useEffect(() => {
          const testLogin = async () => {
            const result = await auth.adminLogin({ username: '', password: '' });
            authResult = result;
          };
          testLogin();
        }, [auth]);

        return <div>Test</div>;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authResult).not.toBeNull();
        });
      });

      expect(authResult.success).toBe(false);
      expect(authResult.message).toContain('required');
    });

    test('should reject credentials with insufficient length', async () => {
      let authResult = null;
      
      const TestWrapper = () => {
        const auth = useAdminAuth();
        
        React.useEffect(() => {
          const testLogin = async () => {
            const result = await auth.adminLogin({ username: 'ab', password: '123' });
            authResult = result;
          };
          testLogin();
        }, [auth]);

        return <div>Test</div>;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authResult).not.toBeNull();
        });
      });

      expect(authResult.success).toBe(false);
    });

    test('should handle expired sessions correctly', async () => {
      // Set up an expired session
      const expiredTime = new Date(Date.now() - 1000).toISOString();
      localStorage.setItem('adminToken', 'expired-token');
      localStorage.setItem('adminUser', JSON.stringify({ username: 'admin' }));
      localStorage.setItem('adminSessionExpiry', expiredTime);

      let authState = null;
      
      const TestWrapper = () => {
        return <TestComponent onAuthChange={(auth) => { authState = auth; }} />;
      };

      await act(async () => {
        renderWithProviders(<TestWrapper />);
        await waitFor(() => {
          expect(authState).not.toBeNull();
        });
      });

      // Expired session should result in logged out state
      expect(authState.isAdminAuthenticated).toBe(false);
      expect(authState.adminUser).toBeNull();
      
      // Storage should be cleared
      expect(localStorage.getItem('adminToken')).toBeNull();
      expect(localStorage.getItem('adminUser')).toBeNull();
      expect(localStorage.getItem('adminSessionExpiry')).toBeNull();
    });
  });
});