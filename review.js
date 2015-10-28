Parse.initialize("SpAJGuvvGd5g0SHBKEPdFY4OjZ3bnBLrE0PcUcP2", "296JykhMPDB8F99wzBj36iMJowoxZPlKeSEX6Adx");

//Connecting to Parse.com
var Review = Parse.Object.extend('Review');
var reviewItem = new Review();
var average = 0;
var total = 0;

//Sends information in form to parse and saves it
$('form').submit(function() {
    total++;
    var reviewItem = new Review();
    reviewItem.set("rating", $(".rating").raty("score"));
    reviewItem.set("title", $("#title").val());
    reviewItem.set("review", $("#review").val());
    reviewItem.set("name", $("#name").val());

    reviewItem.save(null, {
        success: function() {
            getData();
            document.getElementById("form").reset();
            $('#newRating').raty({ score: 0 });
        }
    });
    return false
});

//Retrieves reviews from parse.com
var getData = function() {
    var query = new Parse.Query(Review);
    query.exists('review');

    query.find({
        success: function(response){
            buildList(response);
        }
    });
};

//Passes reviews to addItem
var buildList = function(data) {
    $('#past-reviews').empty();
    // Loop through your data, and pass each element to the addItem function
    data.forEach(function(d) {
        addItem(d);
    });
};


// Takes in an item, adds it to the screen
var addItem = function(item) {

    var upVotes = 0;
    var rating = item.get('rating'); //an array
    var title = $('<h3 class="titleInput">' + item.get('title') + '</h3>');
    var review = $('<p class="reviewInput">' + item.get('review') + '</p>');
    var name = $('<p class="nameInput"> A review by ' + item.get('name') + '</p>');
    var div = $('<div class="review"></div>');
    var starDiv = $('<div class="rating"></div>');
    starDiv.raty({ score: rating[1]});

    if (total > 0) {
        average += rating[1];
    }

    var upVote = $('<p id="upvote">Did you find this review helpful? </p>');
    var upVoteButton = $('<button><span class=".btn-sm">Yes</span></button>');
    upVote.append(upVoteButton);

    upVoteButton.on('click', function() {
        upVotes++;
        getData();
    });

    var upVoteCount = $('<p>' + upVotes + ' people found this review helpful</p>');

    //Delete button for removing a review (also removes from Parse)
    var button = $('<button class="delete"><span class="glyphicon glyphicon-remove"></span></button>');
    button.on('click', function() {
        item.destroy({
            success: function() {
                getData();
                total--;
                average -= rating[1];
            }
        });
    });

    //Puts parts of the review (name, title, etc) together on page
    div.prepend(title);
    $('#past-reviews').append(div);
    div.append(name);
    title.prepend(starDiv);
    starDiv.append(button);
    name.append(review);
    div.append(upVoteCount);
    div.append(upVote);
};

// Called when page loads to get reviews
getData();

$(document).ready(function(){
    $('.rating').raty({ score: 0 });

    //  Calculates review average
    if(total > 0) {
        $('#avg-rating').raty({ score: average/total });
    }
});