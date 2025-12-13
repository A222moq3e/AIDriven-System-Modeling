import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { updateUserProfile, changeUserPassword } from '../services/api'

export function ProfilePage() {
  const { user, accessToken, updateUser } = useAuth()
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)

  const handleCancelProfile = () => {
    setIsEditingProfile(false)
    setUsername(user?.username || '')
    setEmail(user?.email || '')
    setProfileError('')
    setProfileSuccess('')
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setIsLoadingProfile(true)

    try {
      const { user: updatedUser } = await updateUserProfile({
        username,
        email,
        accessToken,
      })
      
      // Update user in context
      updateUser(updatedUser)
      
      setProfileSuccess('Profile updated successfully')
      setIsEditingProfile(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile')
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleCancelPassword = () => {
    setIsChangingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    // Validate password fields
    if (!currentPassword) {
      setPasswordError('Current password is required')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setIsLoadingPassword(true)

    try {
      await changeUserPassword({
        currentPassword,
        newPassword,
        accessToken,
      })
      
      setPasswordSuccess('Password changed successfully')
      setIsChangingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password')
    } finally {
      setIsLoadingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-8 container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
        
        {/* Profile Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your username and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="text-lg">{user?.username || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Member since</Label>
                  <p className="text-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Button onClick={() => setIsEditingProfile(true)} className="mt-4">
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoadingProfile}
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]{3,30}"
                    title="Username must be 3-30 characters and contain only letters, numbers, and underscores"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoadingProfile}
                  />
                </div>

                {profileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                {profileSuccess && (
                  <Alert>
                    <AlertDescription>{profileSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoadingProfile}>
                    {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelProfile}
                    disabled={isLoadingProfile}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isChangingPassword ? (
              <Button onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isLoadingPassword}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoadingPassword}
                    placeholder="Enter new password"
                    minLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoadingPassword}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {passwordSuccess && (
                  <Alert>
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoadingPassword}>
                    {isLoadingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelPassword}
                    disabled={isLoadingPassword}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

