
function IndexController() {
	
	// bind event listeners to button clicks //
	var that = this;
	
	var postShowTemplate = '<li style="display:none;" id=childDelegateRow_{{cdelegateID}}><img class="tImage" src={{ImageSrc}}><h3>{{Name}}</h3><p>{{Company}}</p><div><button onclick="removeSharing({{delegateID}})" type="button" class="removeButton spnbtntext"><img tooltip="Remove" src="/Content/images/remove.png" /></button></div></li>';
	
	var pShowTemplate = '<div style="display:none;" class="panel panel-default"><div class="panel-heading"><h4>Posted by {{byUser}}</h4><h6><small>{{PostedDate}}</small></h6></div><div class="panel-body"><div class="clearfix"></div><p class="postContent">{{Content}}</p><hr><div><div class="input-group"><div class="input-group-btn"><button postid="{{postID}}" class="btn btn-default t-button-postlike"><i class="glyphicon glyphicon-thumbs-up"></i></button><button class="btn btn-default disabled"><i class="glyphicon">-</i></button></div></div></div></div></div>';
	
	function addNewPostRow(postDataComposite) {
		var rowHtml = ' ';
		
		rowHtml += pShowTemplate.replace(/{{byUser}}/, postDataComposite.postedByName);
		rowHtml = rowHtml.replace(/{{Content}}/, postDataComposite.postData);
		rowHtml = rowHtml.replace(/{{postID}}/, postDataComposite._id);
		rowHtml = rowHtml.replace(/{{PostedDate}}/, postDataComposite.createdDate);
		
		$("div#postsContainer").prepend(rowHtml);
		$("div#postsContainer .panel:first").fadeIn(2000);
		
		rowHtml = ' ';
	}
	
	// handle user logout //
	$('#link-logout').click(function () {
		that.attemptLogout();
	});
	
	$('#button-post').click(function () {
		var postData = $('#textbox-post').val();
		if(!postData || postData == '')
                {
                    alert("Please provide data.");
                    //$('#textbox-post').animate({ height: "28px" });
                    return false;
                    }
		$.ajax({
			url: '/userPost',
			type: 'POST',
			data: { postedTo: $('#wallUserId').val() , postedToName: $('#wallUserFullName').val(), postedBy: $('#userId').val(), postedByName: $('#LoginUserFullName').val(), postData: postData },
			success: function (data) {
				console.log(data);
				if (data !== undefined && data.length != 0) {
					$('#textbox-post').val('');
					addNewPostRow(data[0]);
				}
			},
			error: function (jqXHR) {
				console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
			}
		});
            

	});
	
	// Post like
	
	$('.t-button-postlike').live("click", function () {
		
		var el = $(this);
		var post_ID = $(this).attr('postid');
		
		$.ajax({
			url: '/userLike',
			type: 'POST',
			data: { byuserId: $('#userId').val(), postId: post_ID },
			success: function (data) {
				
				var childel = $(el.children('.glyphicon'));
				
				if (childel.hasClass('glyphicon-thumbs-down')) {
					childel.attr('class', 'glyphicon glyphicon-thumbs-up');
				}
				else {
					childel.attr('class', 'glyphicon glyphicon-thumbs-down');
				}
			},
			error: function (jqXHR) {
				console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
			}
		});
	});
	
	// confirm account deletion //
	$('#account-form-btn1').click(function () { $('.modal-confirm').modal('show') });
	
	// handle account deletion //
	$('.modal-confirm .submit').click(function () { that.deleteAccount(); });
	
	this.deleteAccount = function () {
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/delete',
			type: 'POST',
			data: { id: $('#userId').val() },
			success: function (data) {
				that.showLockedAlert('Your account has been deleted.<br>Redirecting you back to the homepage.');
			},
			error: function (jqXHR) {
				console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
			}
		});
	}
	
	this.attemptLogout = function () {
		var that = this;
		$.ajax({
			url: "/logoutUser",
			type: "POST",
			data: { logout : true },
			success: function (data) {
				
				window.location.href = '/';
			},
			error: function (jqXHR) {
				console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
			}
		});
	}
	
	this.loadAccounts = function () {
		var that = this;
		$.ajax({
			url: "/Acounts",
			dataType: "json",
			type: "GET",			
			success: function (data) {
				
				console.log(data);
				alert(data);
			},
			error: function (jqXHR) {
				console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
			}
		});
	}
	
	this.showAccounts = function (msg) {
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function () { window.location.href = '/'; })
		setTimeout(function () { window.location.href = '/'; }, 3000);
	}
	
	this.showLockedAlert = function (msg) {
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function () { window.location.href = '/'; })
		setTimeout(function () { window.location.href = '/'; }, 3000);
	}
}

IndexController.prototype.onUpdateSuccess = function () {
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
