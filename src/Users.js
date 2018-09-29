const axios = require('axios');


   module.exports.getUsers = function getUsers() {
        return new Promise((resolve,reject) => {
            axios.all([
                axios.get('http://localhost:8000/friends'),
                axios.get('http://localhost:8001/plays')
            ]).then(axios.spread((friendsResponse, playsResponse) => {
                let usersWithFriends = friendsResponse.data.friends,
                    usersWithPlays = playsResponse.data.users,
                    usersToBeProcessed = new Set();

                //add users with friends to users to be processed list
                usersWithFriends.forEach((user) => usersToBeProcessed.add(user.username));

                //add users with plays to users to be processed list
                usersWithPlays.forEach((user) => usersToBeProcessed.add(user.username));

                if (usersToBeProcessed.size) {
                    processUsers(usersToBeProcessed)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
                else {
                    resolve([]);
                }
            })).catch(error => {
                reject(error);
            });
        });
    };

    module.exports.getUser = function getUser(id) {
        return new Promise((resolve,reject) => {
            let users = new Set();
            users.add(id);

            processUsers(users,true)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    function processUsers(users, userDetail) {
        let result = [], usersProcessed = 0;

        return new Promise ((resolve,reject) => {
            users.forEach((user) => {
                axios.all([
                    axios.get(`http://localhost:8000/friends/${user}`),
                    axios.get(`http://localhost:8001/plays/${user}`)
                ]).then(axios.spread((friendsResponse, playsResponse) => {
                    let friends = friendsResponse.data.friends,
                        plays = playsResponse.data.plays,
                        userObj = {};

                    //Keep track of number of users processed
                    usersProcessed++;

                    //Populate result user object
                    userObj.username = user;
                    userObj.plays = plays.length;
                    userObj.friends = friends.length;

                    //If user detail information is requested, add track info
                    if(userDetail) {
                        userObj.tracks = getTracks(plays);
                    }
                    userObj.uri = `/users/${user}`;

                    result.push(userObj);

                    //Return when all given users are processed
                    if (usersProcessed === users.size) {
                        resolve(result);
                    }

                })).catch(error => {
                    reject(error);
                });
            });
        });

    }

    function getTracks(plays) {
       let tracks = new Set();

       plays.forEach(play => tracks.add(play));
       return tracks.size;
    }