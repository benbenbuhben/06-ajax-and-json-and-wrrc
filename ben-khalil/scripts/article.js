'use strict';

function Article(rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// The below method is not written as an arrow function because it wants to maintain its contextual scope. It will be operating on an object instance (which will be its this). If it were an arrow function, it would be grabbing the "this" from the global scope.
Article.prototype.toHtml = function () {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // If the publishedOn checkbox is clicked, then its value will be truthy and the publishStatus property of the object will be assigned the value of 'published x number of days ago'. If it remains unchecked, the publishStatus property will be 'draft'.
  // 
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// PUT YOUR RESPONSE HERE
Article.loadAll = articleData => {
  //console.log(articleData);
  articleData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  console.log('life');
  if (localStorage.rawData) {

    let local = localStorage.getItem('rawData');

    Article.loadAll(JSON.parse(local));

    articleView.initIndexPage();

  } else {

    //If local storage doesn't exist, then load the json object and set to local storage.

    let url = 'data/hackerIpsum.json';

    console.log(url);

    $.getJSON(url)
      .then(data => {
        Article.loadAll(data);
        localStorage.setItem('rawData', JSON.stringify(data));
        articleView.initIndexPage();
      })
      .catch(err => console.error('You suck', err));

  

      







  }
}