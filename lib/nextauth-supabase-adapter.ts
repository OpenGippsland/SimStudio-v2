import { Adapter } from "next-auth/adapters";
import { supabase } from "./supabase";
import { getUserByEmail, createUser } from "./db-supabase";

/**
 * Custom adapter for NextAuth to use with Supabase
 */
export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const { email, name } = user;
      
      try {
        // Create user in our database
        const newUser = await createUser({ 
          email,
          name: name || null,
          // If name contains a space, try to split it into first_name and last_name
          ...(name && name.includes(' ') ? {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ')
          } : {})
        });
        
        return {
          id: String(newUser.id),
          email,
          emailVerified: new Date(),
          name: name || email.split('@')[0]
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },
    
    async getUser(id) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        
        if (error || !data) return null;
        
        // Use the user's actual name if available, otherwise use first_name and last_name,
        // and if those aren't available, fall back to the email prefix
        const userName = data.name || 
                        ((data.first_name || data.last_name) ? 
                          `${data.first_name || ''} ${data.last_name || ''}`.trim() : 
                          data.email.split('@')[0]);
        
        return {
          id: String(data.id),
          email: data.email,
          emailVerified: null,
          name: userName
        };
      } catch (error) {
        console.error("Error getting user:", error);
        return null;
      }
    },
    
    async getUserByEmail(email) {
      try {
        const user = await getUserByEmail(email);
        
        if (!user) return null;
        
        // Use the user's actual name if available, otherwise use first_name and last_name,
        // and if those aren't available, fall back to the email prefix
        const userName = user.name || 
                        ((user.first_name || user.last_name) ? 
                          `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                          user.email.split('@')[0]);
        
        return {
          id: String(user.id),
          email: user.email,
          emailVerified: null,
          name: userName
        };
      } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
      }
    },
    
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        // For now, we don't support OAuth providers
        return null;
      } catch (error) {
        console.error("Error getting user by account:", error);
        return null;
      }
    },
    
    async updateUser(user) {
      try {
        const { id, ...userData } = user;
        
        const { data, error } = await supabase
          .from('users')
          .update(userData)
          .eq('id', parseInt(id))
          .select()
          .single();
        
        if (error) throw error;
        
        // Use the user's actual name if available, otherwise use first_name and last_name,
        // and if those aren't available, fall back to the email prefix
        const userName = data.name || 
                        ((data.first_name || data.last_name) ? 
                          `${data.first_name || ''} ${data.last_name || ''}`.trim() : 
                          data.email.split('@')[0]);
        
        return {
          id: String(data.id),
          email: data.email,
          emailVerified: null,
          name: userName
        };
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },
    
    async deleteUser(userId) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', parseInt(userId));
        
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
    
    async linkAccount(account) {
      // For now, we don't support OAuth providers
      return account;
    },
    
    async unlinkAccount({ providerAccountId, provider }) {
      // For now, we don't support OAuth providers
    },
    
    async createSession({ sessionToken, userId, expires }) {
      try {
        // Store session in a temporary object since we're using JWT strategy
        return {
          sessionToken,
          userId,
          expires
        };
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    },
    
    async getSessionAndUser(sessionToken) {
      // We're using JWT strategy, so this shouldn't be called
      return null;
    },
    
    async updateSession({ sessionToken }) {
      // We're using JWT strategy, so this shouldn't be called
      return null;
    },
    
    async deleteSession(sessionToken) {
      // We're using JWT strategy, so this shouldn't be called
    },
    
    async createVerificationToken({ identifier, expires, token }) {
      try {
        // Store verification token in a temporary object
        // In a production environment, you would store this in a database
        const verificationTokens = global.verificationTokens || {};
        verificationTokens[identifier] = { token, expires };
        global.verificationTokens = verificationTokens;
        
        return {
          identifier,
          token,
          expires
        };
      } catch (error) {
        console.error("Error creating verification token:", error);
        throw error;
      }
    },
    
    async useVerificationToken({ identifier, token }) {
      try {
        // Retrieve and delete the verification token
        const verificationTokens = global.verificationTokens || {};
        const verificationToken = verificationTokens[identifier];
        
        if (!verificationToken || verificationToken.token !== token) {
          return null;
        }
        
        // Delete the token
        delete verificationTokens[identifier];
        global.verificationTokens = verificationTokens;
        
        return {
          identifier,
          token,
          expires: verificationToken.expires
        };
      } catch (error) {
        console.error("Error using verification token:", error);
        return null;
      }
    }
  };
}
