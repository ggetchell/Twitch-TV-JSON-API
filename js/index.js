$(document).ready(function(){
  var time = 100;
  var filter = '';
  var type = 'All';
  var users = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","medrybw","Twitch","KrisVos130", "Muffinhead_123"];
  var userDataTimesNeededToRun = 0;
  var userData = [];
  userDataTimesNeededToRun = users.length;
  users.map(function(user){
    getUserData(user);
  });

  function addDataToScreen() {
    var users_list = $("#users-ul");
    users_list.empty();
    userData.map(function(data){
      var live = data[2];
      if (data[0].toLowerCase().indexOf(filter.toLowerCase()) > -1) {
        if (live && (type === 'Online/Offline' || type === 'Online')) {
          var $li = $("<li data-name='" + data[0] + "' class='col-md-12' style='display: none'>").appendTo('#users-ul');
          $li.append("<img class='user-picture' src='" + data[1].stream.channel.logo + "'/>");
          var $p = $("<p class='user-title'>").appendTo($li);
          $p.append(data[0]);
          $p.append("<br/>");
          var $small = $("<small class='user-topic'>").appendTo($p);
          $small.append(data[1].stream.channel.status);
          $li.append("<i class=\"fa fa-check fa-2x user-status-live\">");
        } else if (!live && (type === 'All' || type === 'Offline')){
          var $li = $("<li data-name='" + data[0] + "' class='col-md-12' style='display: none'>").appendTo('#users-ul');
          $li.append("<img class='user-picture' src='" + data[1].logo + "'/>");
          var $p = $("<p class='user-title'>").appendTo($li);
          $p.append(data[0]);
          $li.append("<i class=\"fa fa-times fa-2x user-status-not-live\">");
        }
      }
    });
    $("#loading").remove();
    $("#users-ul li").each(function(index, item){
      setTimeout(function () {
        $(item).removeAttr("style");
      }, index*time);
      time = 50;
    });
  }



  function getUserData(username){
    var url = "https://api.twitch.tv/kraken/streams/" + username + "?callback=?";
    $.getJSON(url, function(){}).done(function(data) {
      if (data.stream === null) {
        url = "https://api.twitch.tv/kraken/channels/" + username + "?callback=?";
        $.getJSON(url, function(){}).done(function(data) {
          if (data.logo === undefined || data.logo === null) {
            data.logo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
          }
          userData.push([username, data, false]);
          userDataTimesNeededToRun--;
          if (userDataTimesNeededToRun === 0) {
            userData = userData.sort();
            addDataToScreen();
          }
        });
      } else {
        userData.push([username, data, true]);
        userDataTimesNeededToRun--;
        if (userDataTimesNeededToRun === 0) {
          userData = userData.sort();
          addDataToScreen();
        }
      }
    });
  }
  
  var $all = $("#button-online/offline");
  var $on = $("#button-online");
  var $off = $("#button-offline");
  $all.click(function(){
    type = 'All';
    addDataToScreen();
    $all.removeClass('selected');
    $on.removeClass('selected');
    $off.removeClass('selected');
    $all.addClass('selected');
  });
  $on.click(function(){
    type = 'Online';
    addDataToScreen();
    $all.removeClass('selected');
    $on.removeClass('selected');
    $off.removeClass('selected');
    $on.addClass('selected');
  });
  $off.click(function(){
    type = 'Offline';
    addDataToScreen();
    $all.removeClass('selected');
    $on.removeClass('selected');
    $off.removeClass('selected');
    $off.addClass('selected');
  });
  $("#users-ul").on('click', '>li', function(){
    window.open('http://twitch.tv/' + $(this).data('name'));
  });
  $("#search").on('keyup paste',     function(){
    filter = this.value;
    addDataToScreen();
  });
  setInterval(120000, function(){
    userData = [];
    users.map(function(user){
      getUserData(user);
    });
  });
});