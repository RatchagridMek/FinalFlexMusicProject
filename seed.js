var mongoose = require('mongoose');
const favourite = require('./models/favourite');
var playlist = require('./models/Playlist');

// var data = [
//     {
//         name : "Playlist1",
//         songlist: "test1",
//         ownerID: "ObjectID1"
//     },
//     {
//         name : "Playlist2",
//         songlist: "test2",
//         ownerID: "ObjectID2"
//     }
// ];

var data = [
    {
        name:"Playlist",
        songlist: "test",
        ownerID: "ObjectID",
        description: "This is the best collection 1"
    }
]

var data2 = [
    {
        owner: "name",
        name: "songname1",
        artist: "artist1"
    }
]

    function seedDB(){
        data.forEach(function(seed){
            playlist.create(seed,function(err,allCollection){
                if(err){
                    console.log(err);
                }
                else if(allCollection){
                    console.log("add yor data");
                    console.log(allCollection);
                }
            })
        })
    }

// function seedDB(){
//     data.forEach(function(seed){
//         playlist.create(seed,function(err,allCollection){
//             if (err){
//                 console.log(err);
//             }
//             else if(allCollection){
//                 console.log("Add your data");
//                 console.log(allCollection);
//             }
//         })
//     })
// }

module.exports = seedDB;