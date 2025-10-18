# Owner Account Login Instructions

## Owner Email
- **Email:** selflevelings@gmail.com
- **Status:** Owner account with full access privileges

## How to Log In

### First Time Login
1. Navigate to the application login page
2. Enter email: `selflevelings@gmail.com`
3. Enter your chosen password
4. Click "Sign In"

**Important:** On first login attempt with invalid credentials, the system will automatically:
- Create the owner account if it doesn't exist
- Set up all necessary profile and user records
- Grant full access privileges
- Log you in immediately

### Subsequent Logins
Simply use your email and password as normal. The system recognizes the owner email and grants immediate access.

## Owner Privileges

The owner account automatically receives:
- ✅ **SS Rank** - Highest rank in the system
- ✅ **999,999 XP** - Maximum experience points
- ✅ **999 Day Streak** - Maximum streak
- ✅ **Subscription Bypass** - Full access without payment
- ✅ **Premium Features** - All features unlocked
- ✅ **Full Dashboard Access** - Complete access to all functionality

## Technical Details

### Database Setup
- `profiles.is_owner` flag set to `true`
- `users.subscription_active` set to `true`
- `users.rank` set to `SS`
- Automatic profile creation via `handle_new_user()` trigger

### Security
- Owner detection is hardcoded in multiple layers
- Email comparison: `selflevelings@gmail.com`
- Database-level functions: `is_owner()`, `has_access()`
- Application-level checks in auth hooks
- RLS policies grant full access

### Auto-Registration
The `ensureOwnerAccount()` function in `src/lib/auth.ts` handles:
1. Attempting normal login
2. Creating account if login fails with "invalid" error
3. Automatically logging in the newly created account
4. Setting up all owner privileges via database trigger

## Troubleshooting

### "Invalid Login" Error
- This is expected on first login
- The system will auto-create the account
- Try logging in again with the same credentials

### Account Already Exists
- If the account was previously created, just use your password
- The system automatically grants owner privileges on every login

### No Subscription Access
- Owner account always bypasses subscription checks
- If you see subscription prompts, verify you're logged in with `selflevelings@gmail.com`
- Check browser console for any auth errors

## Code References

### Key Files
- `src/lib/auth.ts` - Owner detection and auto-registration
- `src/hooks/useAuth.ts` - Owner status tracking
- `src/hooks/useSubscription.ts` - Subscription bypass logic
- `src/components/AuthModal.tsx` - Login form with owner handling
- `supabase/migrations/setup_complete_database_with_owner.sql` - Database setup

### Database Functions
- `public.is_owner()` - Returns true for owner email
- `public.has_access()` - Returns true for owner or active subscribers
- `public.handle_new_user()` - Auto-setup trigger for new users
- `public.initialize_owner_if_needed()` - Manual owner account initialization

## Notes

- No email verification required for owner account
- Normal users follow standard authentication flow
- Only `selflevelings@gmail.com` receives special treatment
- All security measures remain in place for regular users
