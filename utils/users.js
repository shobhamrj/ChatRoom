const users = [];

// join user to chat
function userJoin(id, userName, room) {
    const user = { id, userName, room };
    users.push(user);
    return user;
}

// get the current user
function getCurrentUser(id) {
    return users.find(user => {user.id === id});
}

export default {
    userJoin,
    getCurrentUser
}