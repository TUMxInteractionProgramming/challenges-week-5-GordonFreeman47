/* start the external action and say hello */
console.log("App is alive");


/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/*global array with channels inside*/
var channels = [yummy, sevencontinents, killerapp,firstpersononmars, octoberfest];


/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    //adjust the app bar
    abortState();
   
    /* #7 remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* #7 set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');

    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    $('#chat h1 i').toggleClass('fas');
    $('#chat h1 i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
    listChannels(tabId);
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {

    //only loaded when clicked for the first time 
    if($('#emojis').html()=='') {
        var emojis = require('emojis-list');
        for(var i=0; i<emojis.length; i++) {
            $('#emojis').append(emojis[i]);
        }
    }
    $('#emojis').toggle(); // #toggle
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());
    console.log("New message:", message);

    if($('#message').val().length > 0) {
        // #8 convenient message append with jQuery:
        $('#messages').append(createMessageElement(message));

        // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
        // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));

        // #8 clear the message input
        $('#message').val('');

        //work with objects: 
        currentChannel.messages.push(message); //add message to channel
        currentChannel.messageCount+=1; //increase number 
        //console.log(currentChannel);

    }
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent-button">+5 min.</button>' +
        '</div>';
}


function listChannels(sorting) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    $('#channels ul').empty();
    switch(sorting) {
        case '#tab-new':
            channels.sort(compareDate);
            break;
        case '#tab-trending':
            channels.sort(compareMessages);
            break;
        case '#tab-favorites':
            channels.sort(compareFavorites);
            break;
    }
    
    for(var i = 0; i<channels.length; i++) {
        $('#channels ul').append(createChannelElement(channels[i]));
    }
    //to make one channel selected 
    $('#channels li:contains(#SevenContinents)').addClass('selected');
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);
    channel.attr('onclick', 'switchChannel('+JSON.stringify(channelObject)+')');

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    //clickable 
    // return the complete channel
    return channel;
}




/**
 * To compare the created on date
 * @param {First Channel} channelOne 
 * @param {Second Channel} channelTwo 
 */
function compareDate (channelOne, channelTwo){
    if(channelOne.createdOn < channelTwo.createdOn) {
        return 1; //channelOne was created earlier
    } else {
        return -1; //channelTwo was created earlier
    }
}

/**
 * To compare the number of messages
 * @param {First Channel} channelOne 
 * @param {Second Channel} channelTwo 
 */
function compareMessages (channelOne, channelTwo){
    if(channelOne.messageCount < channelTwo.messageCount) {
        return 1; //channelOne was created earlier
    } else {
        return -1; //channelTwo was created earlier
    }
}

/**
 * To compare the favorites
 * @param {First Channel} channelOne 
 * @param {Second Channel} channelTwo 
 */
function compareFavorites (channelOne, channelTwo){
    if(channelOne.starred && !channelTwo.starred) {
        return -1; //channelOne was created earlier
    } else if (!channelOne.starred && channelTwo.starred){
        return 1; //channelTwo was created earlier
    } else if(!channelOne.starred && !channelTwo.starred) {
        return -1;
    } else {
        return 1;
    }
}

/**
 * 
 */
function addChannel() {
    //clear messages
    $('#messages').empty();

    //create input field
    var inputField = $('<input type="text" placeholder="Enter a #ChannelName" maxlength = "500">');
    var abortButton = $('<button class = "primary-button" onclick="abortState()"><i class="fas fa-times"></i>Abort</button>');

    //create the new 'app bar'
    $('#chat h1').css('display', 'none');
    var div = $('<div id="new-channel-header"></div>');
    div.append(inputField).append(abortButton);
    $('#chat').append(div);

    //swap send button 
    $('#send-button').css('display', 'none');
    var createButton = $('<button class = "accent-button" onclick="createChannel()" id="create-button">create</button>');
    $('#chat-bar').append(createButton);

}

/**
 * Finally creates the channel when create is pressed
 */
function createChannel() {
    //create Channel Object if valid 
    if($('#new-channel-header input').val().length > 0 && $('#message').val().length > 0) {
        var channelInput = $('#new-channel-header input').val();
        if(channelInput.substring(0,1) == '#' && !hasWhiteSpace(channelInput)) {
            var newChannel = new Channels(channelInput);
            currentChannel = newChannel;
            
            //create message
            var message = new Message($('#message').val());
            currentChannel.messages.push(message); //add message to channel
            currentChannel.messageCount+=1; //increase number 
            
            //add channel to array 
            channels.push(newChannel);

            //clear input fields
            $('#new-channel-header input').val('');
            $('#message').val('');

            listChannels('#tab-new');
            abortState();
            
          
        }
       
    }
}

/**
 * Constructor: will create a new channel Object
 * @param {*} name 
 * @constructor
 */
function Channels(name){
    this.name = name;
    this.createdOn = new Date() //now:
    this.createdBy = currentLocation.what3words;
    this.starred = false;
    this.expiresIn = parseInt(Date.now()/1000/60); 
    this.messageCount = 0;
    this.messages = [];
}

/**
 * Aborts the current task (creating a new channel)
 */
function abortState(){
    //restore the app bar
    $('#new-channel-header').remove();
    $('#chat h1').text(currentChannel.name).append(' by <a href="http://w3w.co/'
    + currentChannel.createdBy
    + '" target="_blank"><strong>'
    + currentChannel.createdBy
    + '</strong></a>');
    $('#chat h1').css('display', 'block');

    //restore the messages
    for(var i=0; i<currentChannel.messages.length; i++) {
        $('#messages').append(createMessageElement(currentChannel.messages[i]));
    }

    //recreate initial sending button
    $('#create-button').remove();
    $('#send-button').css('display', 'inline');
}


/**
 * Checks a given string for white spaces 
 * @param {String} s 
 */
function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}