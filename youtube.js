$(function() {

    var pageToken = "";
    var searchQuery = "";

    loader();

    searchAjax();

    infiniteScroll();

    searchBox();

    function searchAjax(searchQuery) {
        if(searchQuery) {
            var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q="+searchQuery+"&regionCode=IN&relevanceLanguage=en&safeSearch=strict&type=video&videoEmbeddable=true&pageToken="+pageToken+"&key=AIzaSyAJg09YHoM-hC7hdkRIapDZHT_jt60DXqE";
        } else {
            var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&regionCode=IN&relevanceLanguage=en&safeSearch=strict&type=video&videoEmbeddable=true&pageToken="+pageToken+"&key=AIzaSyAJg09YHoM-hC7hdkRIapDZHT_jt60DXqE"
        }
        $.ajax({
            url: url, 
            success: function(result){
                pageToken = result.nextPageToken;
                for(var i = 0; i < result.items.length; i++) {
                    var today = new Date();
                    var videoDate = new Date(result.items[i].snippet.publishedAt);
                    var time = calcDate(today, videoDate);
                    $('#video-tabs').append(` <div class="center-block col-sm-6 col-md-3 col-lg-3 box-tab clearfix">
                    <div class="thumbnails">
                        <div class="thumb-box"><iframe class="youtube-frame" src="https://www.youtube.com/embed/${result.items[i].id.videoId}?controls=0">
                        </iframe></div>
                        <div class="caption">
                        <strong><p class="limit" id="limit${i}">${result.items[i].snippet.title}</p></strong>
                            <div>
                                <p class="channel-name">${result.items[i].snippet.channelTitle}</p>
                                <p>${time} ago</p>
                            </div>
                            
                        </div>
                      </div>
                </div>`);
                limitTitleText(i);
                }
            }
        }); 
    }
    
    function limitTitleText(value){
        var tabTitle = ($("#limit"+value).text()).toLowerCase();
        var contentLength = tabTitle.length;
        if(contentLength > 45) {
            var shortText = tabTitle.slice(0,45);
            $("#limit"+value).html( shortText+"<span title='"+tabTitle+"'>...</span>")
        }
        
    }

    function calcDate(today,videoDate) {
        var diff = Math.floor(today.getTime() - videoDate.getTime());
        var seconds = Math.floor((diff / 1000) % 60) ;
        var minutes = Math.floor((diff / (1000*60)) % 60);
        var hours   = Math.floor((diff / (1000*60*60)) % 24);
        var weeks = Math.floor(diff / 604800000)
        var day = 1000 * 60 * 60 * 24;
        var days = Math.floor(diff/day);
        var months = Math.floor(days/31);
        var years = Math.floor(months/12);
        if(years){
            var message = years+" years"
            return message;
        }
        if(months){
            var message = months+" months"
            return message;
        }
        if(weeks){
            var message = weeks+" weeks"
            return message;
        }
        if(days){
            var message = days+" days"
            return message;
        }
        if(hours){
            var message = hours+" hours"
            return message;
        }
        if(minutes){
            var message = minutes+" minutes"
            return message;
        }
        if(seconds){
            var message = seconds+" seconds"
            return message;
        }
    }

    function infiniteScroll(){
        $(window).scroll(function(){
            if  ($(window).scrollTop() == $(document).height() - $(window).height()){
                searchAjax(searchQuery);
            }  
        }); 
    }

    function searchBox() {
        $('#search-button').click(function() {
            searchQuery = $('#query').val();
            if(searchQuery) {
                $('#video-tabs').html("");
                searchAjax(searchQuery);
            }
        })
    }

    function loader() {
        $(document).ajaxStart(function(){
            $('.ajax-loader').show();
        }).ajaxComplete(function(){
            $('.ajax-loader').hide();
        });
    }

})