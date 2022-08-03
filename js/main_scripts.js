var config = {
    apiKey: "AIzaSyDAl-sAyQGr3tRpK5TwfPz5lVbfyvdD5TM",
    authDomain: "onurfirebase-8f143.firebaseapp.com",
    databaseURL: "https://onurfirebase-8f143.firebaseio.com",
    projectId: "onurfirebase-8f143",
    storageBucket: "onurfirebase-8f143.appspot.com",
    messagingSenderId: "611179792299",
    appId: "1:611179792299:web:dba6f8ab2cc03713c334ee"
};

firebase.initializeApp(config);
var database = firebase.database();

var ref = firebase.database().ref();
var local_storage = []
var keys2 =[]
ref.on("value", function(snapshot) {
    var interface = document.getElementById("data_firebase")
    // console.log(snapshot.val());
    // console.log(snapshot.val().Makarnalar[0].price)
    var test = snapshot.val()
    // console.log(test)
    var keys = Object.keys(test);
    keys2=keys
    var datas =  Object.values(test) 
    local_storage = test
    // console.log(keys)
    // console.log(Object.values(test))

    //burası card.html ıcın
    // for(var i=0; i<keys.length; i++){
    //     var header =  '<div class="col-lg-6"> <div class="card shadow mb-4"> <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between"> '+
    //     '<h6 class="m-0 font-weight-bold text-primary">'+keys[i]+'</h6> <div class="dropdown no-arrow">Save and Other Options <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
    //     '<i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i> </a> <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"  aria-labelledby="dropdownMenuLink">'+
    //     '<div class="dropdown-header">Settings:</div> <a class="dropdown-item" href="#">Add New Menu</a> <a class="dropdown-item" href="#">Save Categories</a> <a class="dropdown-item" href="#">Delete Items</a> <a class="dropdown-item" href="#">Delete Categories</a> <a class="dropdown-item" href="#">Change Categories Name</a>'+
    //     '</div> </div> </div><div id="datas_menus"></div>' 

    //     var insider = ""
    //     for(var k=0; k<datas[i].length; k++){
    //         insider += '<div class="card-body">  <input class="form-control" type="text" value="'+datas[i][k].name+
    //         '" id="'+datas[i][k].name+'"><br><input class="form-control" type="text" value="'+datas[i][k].details+'" id="'+datas[i][k].details+'"><br><input class="form-control" type="number" value="'+
    //         datas[i][k].price+'" id="'+datas[i][k].price+'"></div><hr>'
    //     }
    //     interface.innerHTML += header + insider +'</div> </div>'
    // }
    //card html son

    var interface_2 = document.getElementById("datas_menu")
    for(var i=0; i<keys.length; i++){
        for(var k=0; k<datas[i].length; k++){
            interface_2.innerHTML += '<tr> <td  id="'+datas[i][k].image+'" onclick=image_view(this)>'+keys[i]+'</td><td>'+datas[i][k].name+'</td><td>'+datas[i][k].details+'</td><td>'+datas[i][k].price+'</td><td>'+
            '<i class="fas fa-edit" style="color:green;" id="'+keys[i] +'**'+ datas[i][k].name+'**'+datas[i][k].details+'**'+datas[i][k].price+'**'+k+'**'+datas[i][k].image+'" onClick=update(this)></i>&nbsp;&nbsp;' +
            '<i class="fas fa-trash-alt" style="color:red;"  id="'+keys[i] +'**'+ datas[i][k].name+'**'+datas[i][k].details+'**'+datas[i][k].price+'**'+k+'**'+datas[i][k].image+'" onClick=remove(this)></i> </td></tr>'
        }
    }
}, function (error) {
    console.log("Error: " + error.code);
});

//test.split("**")[0] --> key or categories

//test.split("**")[1] --> name of menu

//test.split("**")[2] --> details of menu

//test.split("**")[3] --> price of menu

//test.split("**")[4] --> image of menu

function update(d){
    var test = d.id
    Swal.fire({
        title: test.split("**")[0]+ ', '+test.split("**")[1],
        html:'<input type="text" class="form-control" id="name" aria-describedby="Name" placeholder="Name" value="'+test.split("**")[1]+'"> <br>'+
            '<input type="text" class="form-control" id="details" aria-describedby="Details" placeholder="Details" value="'+test.split("**")[2]+'"> <br>'+
            '<input type="number" class="form-control" id="price" aria-describedby="Price" placeholder="Price" value="'+test.split("**")[3]+'"><br>'+
            '<label class="btn btn-warning">  Select Image File <input type="file" id="files" name="files[]" hidden> </label>',
        imageUrl: test.split("**")[5],
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            local_storage = (JSON.stringify(local_storage))
            local_storage = (JSON.parse(local_storage))
            var categories = test.split("**")[0];
            var name = document.getElementById("name").value
            var details = document.getElementById("details").value
            var price = document.getElementById("price").value
            var file = document.getElementById("files").files[0]
            var path = categories + "/" + name
            var to_save_image = firebase.storage().ref(path)
            let thisRef = to_save_image.child(file.name)
            var index = parseInt(test.split("**")[4])
            local_storage[categories].splice(index,1)
            var ref = firebase.database().ref()
            ref.set(local_storage, function () {
                console.log("removed")
            })
            thisRef.put(file).then(res=>{
				console.log("Upload Success")
				alert("Upload Success")
                to_save_image.child(file.name).getDownloadURL().then(url=>{
                    console.log(url)
                        var to_save = firebase.database().ref();
                        var data =     
                            {
                            "name": name,
                            "details": details,
                            "price": parseFloat(price),
                            "image": url
                            }
                        
                        local_storage[categories].push(data)
                        console.log(local_storage)
                        to_save.set(local_storage, function () {
                            Swal.fire("Added", '', 'info')
                            location.reload();
                        })
                })
			}).catch(e =>{
				console.log("Error" + e)				
			})
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info') 
        }
      })
}
function remove(d){
    var test = d.id
    var keys = test.split("**")[0]

     local_storage = (JSON.stringify(local_storage))
     local_storage = (JSON.parse(local_storage))
     var index = parseInt(test.split("**")[4])

    Swal.fire({
        title: test.split("**")[0]+ ', '+test.split("**")[1],
        text: 'Are you sure you want to delete this menu from categories?',
        imageUrl: 'https://unsplash.it/400/200',
        imageWidth: 400,
        imageHeight: 200,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'No, cancel!'
      }).then((result) => {
        if (result.isConfirmed) {
            local_storage[keys].splice(index,1)
            var ref = firebase.database().ref()
            ref.set(local_storage, function () {
                Swal.fire("Deleted", '', 'info')
                location.reload();
            })
        }
      })
}



function newmenu(){
    console.log(keys2)
    var drop = '<select class="form-select btn btn-info " aria-label="Please Select Categories" id="categories">'+
                '<option selected>Please Select Categories</option>'
    for(var i=0;i<keys2.length;i++){
        drop += '<option value="'+keys2[i]+'">'+keys2[i]+'</option>'
    }
    drop += '</select>'

    Swal.fire({
        title: "Add New Menu to Category",
        html: drop +'<br><br>'+
            '<input type="text" class="form-control" id="name" aria-describedby="Name" placeholder="Name"> <br>'+
            '<input type="text" class="form-control" id="details" aria-describedby="Details" placeholder="Details"> <br>'+
            '<input type="number" class="form-control" id="price" aria-describedby="Price" placeholder="Price" ><br>'+
            '<label class="btn btn-warning">  Select Image File <input type="file" id="files" name="files[]" hidden> </label>',
        imageUrl: 'https://unsplash.it/400/200',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            local_storage = (JSON.stringify(local_storage))
            local_storage = (JSON.parse(local_storage))
            var select = document.getElementById("categories");
            var categories = select.options[select.selectedIndex].value;
            var name = document.getElementById("name").value
            var details = document.getElementById("details").value
            var price = document.getElementById("price").value
            var file = document.getElementById("files").files[0]
            var path = categories + "/" + name
            var to_save_image = firebase.storage().ref(path)
            let thisRef = to_save_image.child(file.name)
            thisRef.put(file).then(res=>{
				console.log("Upload Success")
				alert("Upload Success")
                to_save_image.child(file.name).getDownloadURL().then(url=>{
                    console.log(url)
                        var to_save = firebase.database().ref();
                        var data =     
                            {
                            "name": name,
                            "details": details,
                            "price": parseFloat(price),
                            "image": url
                            }
                        
                        local_storage[categories].push(data)
                        console.log(local_storage)
                        to_save.set(local_storage, function () {
                            Swal.fire("Added", '', 'info')
                            location.reload();
                        })
                })
			}).catch(e =>{
				console.log("Error" + e)				
			})
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info') 
        }
      })
}

function newcategory(){
   
    Swal.fire({
        title: "Create New Categories",
        html:'<input type="text" class="form-control" id="cat" aria-describedby="Categories" placeholder="Categories Name"> <br>'+
            '<input type="text" class="form-control" id="name" aria-describedby="Name" placeholder="First Menu Name"> <br>'+
            '<input type="text" class="form-control" id="details" aria-describedby="Details" placeholder="Details"> <br>'+
            '<input type="number" class="form-control" id="price" aria-describedby="Price" placeholder="Price"> <br>'+
            '<label class="btn btn-warning">  Select Image File <input type="file" id="files" name="files[]" hidden> </label>',
        imageUrl: 'https://unsplash.it/400/200',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            local_storage = (JSON.stringify(local_storage))
            local_storage = (JSON.parse(local_storage))

            var cate = document.getElementById("cat").value;
            var name = document.getElementById("name").value
            var details = document.getElementById("details").value
            var price = document.getElementById("price").value
            var file = document.getElementById("files").files[0]
            var path = cate + "/" + name
            var to_save_image = firebase.storage().ref(path)
            let thisRef = to_save_image.child(file.name)

            thisRef.put(file).then(res=>{
				console.log("Upload Success")
				alert("Upload Success")
                to_save_image.child(file.name).getDownloadURL().then(url=>{
                    console.log(url)
                        var to_save = firebase.database().ref();
                        var data =[
                            {
                            "name": name,
                            "details": details,
                            "price": parseFloat(price),
                            "image":url
                            }
                        ]
                        
                    local_storage[cate] = data
                    console.log(local_storage)
                    to_save.set(local_storage, function () {
                        Swal.fire("Added new categories", '', 'info')
                        location.reload();
                    })
                })
			}).catch(e =>{
				console.log("Error" + e)				
			})
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info') 
        }
      })

        //     var to_save = firebase.database().ref();
        //     var data =[
        //         {
        //         "name": name,
        //         "details": details,
        //         "price": parseFloat(price)
        //         }
        //     ]
            
        //     local_storage[cate] = data
        //     console.log(local_storage)
        //     to_save.set(local_storage, function () {
        //         Swal.fire("Added new categories", '', 'info')
        //         location.reload();
        //     })

        // } else if (result.isDenied) {
        //     Swal.fire('Changes are not saved', '', 'info') 
        // }
        // })
}

function deletecategory(){
    Swal.fire('developing...', '', 'info') 
}
function image_view(d){
    var url = d.id
    Swal.fire({
        title: "Image of Menu",
        imageUrl: url,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        })

}