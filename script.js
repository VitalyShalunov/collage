// this variable will hold whichever object is currently being dragged
var currentlyDragging;

// this variable holds the curent mode (0=move, 1=resize, 2=rotate)
var mode = 0;

// these variables stores the old y position of the cursor (it is updated in whileDragging)
var oldY;

// keep track of the highest z-index so far
var maxZ = 1;

// run this code when fully loaded
$(window).load(function () {
    droppedImage();
    // attach the mousedown event to all image tags
    $("img").mousedown(startDragging);

    // attach the mousemove event to the body
    $("body").mousemove(whileDragging);

    // attach the mouseup event to the body
    $("body").mouseup(doneDragging);

    // attach the onchange event to the dropdown toolchooser
    $("#toolchooser").change(changeMode);

});

// start dragging will always fire, then while dragging, and finally done dragging on mouse up

function startDragging(e) {
    // set this image as the current one to be dragged
    currentlyDragging = $(this);

    // set the degrees for this object if it isn't already set, to 0
    if (!currentlyDragging[0].degree)
        currentlyDragging[0].degree = 0;

    // mode 3, bring to front
    if (mode == 3) {
        // this mode will set the clicked on element's z-index to the front so far, and then increment the max z-index for next time
        currentlyDragging.css("z-index", maxZ);
        maxZ++;
    }

    // mode 4, delete
    else if (mode == 4) {
        // delete the curent element
        currentlyDragging[0].parentElement.removeChild(currentlyDragging[0]);
    }
}

function whileDragging(e) {
    if (currentlyDragging == null)
        return false;

    // mode 0, move
    if (mode == 0) {
        // for moving, dragging the image moves it to to the new coordinates

        // offset the new drag coordinates (by half the image height)
        var newY = e.pageY - 150;
        var newX = e.pageX - 150;

        // adjust the x and y values of the currently being dragged image
        currentlyDragging.css({ "margin-top": newY + "px", "margin-left": newX + "px" });
    }
    // mode 1, resize
    else if (mode == 1) {
        // for resizing, dragging the image up makes it larger, down makes it smaller

        // to detect if the cursor moved up or down, we need to check if its y value is greater than or less than the y value that it previously held
        if (e.pageY > oldY) {
            // dragged down, make it smaller
            currentlyDragging.css({ height: '-=10%', width: '-=10%' })
        }
        else if (e.pageY < oldY) {
            // dragged up, make it larger
            currentlyDragging.css({ height: '+=10%', width: '+=10%' })
        }

        // update old Y for the next call to currentlyDragging
        oldY = e.pageY;
    }
    // mode 2, rotate
    else if (mode == 2) {
        // for rotating, going up rotates counterclockwise, and going down rotates clockise

        if (e.pageY > oldY)
            currentlyDragging[0].degree += 1;

        else if (e.pageY < oldY)
            currentlyDragging[0].degree -= 1

        // dragged down, make it smaller
        currentlyDragging.css("transform", 'rotate(' + currentlyDragging[0].degree + 'deg)');

        // update old Y for the next call to currentlyDragging
        oldY = e.pageY;
    }
}

function doneDragging(e) {
    // unset the image that's being dragged
    currentlyDragging = null;
}


// the following function is called when the mode changes

function changeMode() {
    // get the index (0 through 2 of the selection
    var selectedIndex = $(this)[0].selectedIndex;

    // update the global mode variable
    mode = selectedIndex;
}

if (window.FileReader) {
    window.addEventListener('load', function () {

        function cancel(e) {
            if (e.preventDefault) { e.preventDefault(); }
            return false;
        }

        // Tells the browser that we *can* drop on this target
        document.body.addEventListener('dragover', cancel, false);
        document.body.addEventListener('dragenter', cancel, false);

        document.body.addEventListener('drop', droppedImage, false);
    }, false);
} else {
    document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}

async function droppedImage() {
    let url = 'https://boiling-hollows-10781.herokuapp.com/';
   
    //let url = 'http://localhost:3000/';
    let response = await fetch(url);

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа (см. про этот метод ниже)
        let json = await response.json();
        console.log(json)
        json.images.forEach(img => {
            var imgel = document.createElement("img");
            //img.file = file;
            imgel.src = img;
            //console.log($('#field'))
            $('#field')[0].appendChild(imgel);

            $(imgel).attr("draggable", "false");

            // attach the mousedown event to all image tags
            $(imgel).mousedown(startDragging);
        });
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    // for (var i = 0; i < files.length; i++) {
    //     var file = files[i];
    //     var reader = new FileReader();

    //     //attach event handlers here...
    //     reader.readAsDataURL(file);

    //     reader.addEventListener('loadend', function (e, file) {
    //         var bin = this.result;
    //         var img = document.createElement("img");
    //         img.file = file;
    //         img.src = bin;
    //         document.body.appendChild(img);

    //         $(img).attr("draggable", "false");

    //         // attach the mousedown event to all image tags
    //         $(img).mousedown(startDragging);


    //     }.bindToEventHandler(file), false);
    // }

    return false;
}

const getCollage = () => {
    alert('click')
    // const myField = document.getElementById("field");
    // const canvas = document.createElement("canvas");

    // // scale the canvas accordingly
    // canvas.width = myField.width;
    // canvas.height = myField.height;
    // // draw the video at that frame
    // canvas
    //     .getContext("2d")
    //     .drawImage(myField, 0, 0, canvas.width, canvas.height);
    // // convert it to a usable data URL
    // const dataURL = canvas.toDataURL();
    // console.log(dataURL)

    // $(".toolbar")[0].hidden = true;
    // var context = $("canvas")[0].getContext("2d");
    // console.log(context)
    html2canvas(document.getElementsByTagName("body"), {
        onrendered: function (canvas) {
            var myImage = canvas.toDataURL("image/png");
            //create your own dialog with warning before saving file
            //beforeDownloadReadMessage();
            //Then download file
            console.log(myImage)
            var img = $("<img />").attr('src', myImage)
                .on('load', function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alert('broken image!');
                    } else {
                        $("#field").append(img);
                    }
                });
            //downloadURI("data:" + myImage, "yourImage.png");
        }
    });
}

Function.prototype.bindToEventHandler = function bindToEventHandler() {
    var handler = this;
    var boundParameters = Array.prototype.slice.call(arguments);
    //create closure
    return function (e) {
        e = e || window.event; // get window.event if e argument missing (in IE)   
        boundParameters.unshift(e);
        handler.apply(this, boundParameters);
    }
};