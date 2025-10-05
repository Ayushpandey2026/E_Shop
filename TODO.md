# TODO: Update MyProfile.jsx for Account Tab View/Edit Toggle

- [x] Move authHeaders function outside useEffect to fix scope issue
- [x] Add isEditing state to toggle between view and edit mode
- [x] Implement view mode in Account tab: display Name, Email, Phone as text with "Edit Profile" button
- [x] Implement edit mode in Account tab: show form with inputs, Save and Cancel buttons
- [x] Handle "Edit Profile" button click: set isEditing to true
- [x] Handle "Cancel" button click: reset editForm to user data and set isEditing to false
- [x] On form submit success: set isEditing to false
- [x] Test the profile page to verify data display and edit functionality
