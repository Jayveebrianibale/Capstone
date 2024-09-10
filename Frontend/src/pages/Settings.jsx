import  { useState } from 'react';
import { Bell, User, Lock, Camera, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Button, Card, CardContent, CardHeader, CardActions, TextField, Typography, Switch, FormControlLabel, Avatar } from '@mui/material';

const ProfileSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=128&width=128");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full mt-10 max-w-4xl mx-auto p-6 space-y-6">
      <Typography variant="h4" gutterBottom className="font-semibold text-gray-800">Profile Settings</Typography>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="flex border-b border-gray-200 mb-6">
          <TabsTrigger value="account" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500">
            <User className="w-5 h-5 mr-2" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500">
            <Lock className="w-5 h-5 mr-2" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:border-blue-500">
            <Bell className="w-5 h-5 mr-2" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card variant="outlined" className="shadow-md">
            <CardHeader>
              <Typography variant="h6" className="font-semibold text-gray-800">Account Information</Typography>
              <Typography variant="body2" className="text-gray-600">Update your account details and profile picture here.</Typography>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar alt="Profile picture" src={profileImage} sx={{ width: 128, height: 128 }} />
                <div className="flex space-x-2">
                  <Button variant="outlined" size="small" component="label" className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Picture
                    <input
                      id="picture"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {profileImage !== "/placeholder.svg?height=128&width=128" && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setProfileImage("/placeholder.svg?height=128&width=128")}
                      className="flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <TextField id="name" label="Name" placeholder="Enter your name" fullWidth variant="outlined" />
              </div>
              <div className="space-y-4">
                <TextField id="email" label="Email" type="email" placeholder="Enter your email" fullWidth variant="outlined" />
              </div>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary">Save Changes</Button>
            </CardActions>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card variant="outlined" className="shadow-md">
            <CardHeader>
              <Typography variant="h6" className="font-semibold text-gray-800">Security Settings</Typography>
              <Typography variant="body2" className="text-gray-600">Manage your password and security preferences.</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <TextField id="current-password" label="Current Password" type="password" fullWidth variant="outlined" />
              </div>
              <div className="space-y-4 mb-6">
                <TextField id="new-password" label="New Password" type="password" fullWidth variant="outlined" />
              </div>
              <div className="space-y-4">
                <TextField id="confirm-password" label="Confirm New Password" type="password" fullWidth variant="outlined" />
              </div>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary">Update Password</Button>
            </CardActions>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card variant="outlined" className="shadow-md">
            <CardHeader>
              <Typography variant="h6" className="font-semibold text-gray-800">Notification Preferences</Typography>
              <Typography variant="body2" className="text-gray-600">Choose how you want to be notified.</Typography>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <FormControlLabel
                    control={
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                    }
                    label="Email Notifications"
                    labelPlacement="end"
                  />
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <div className="flex items-center justify-between">
                  <FormControlLabel
                    control={
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                      />
                    }
                    label="Push Notifications"
                    labelPlacement="end"
                  />
                  <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
