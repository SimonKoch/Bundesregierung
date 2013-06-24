/* Start twitter-jquery.js */
/*
 * jTweetsAnywhere V1.2.1
 * http://thomasbillenstein.com/jTweetsAnywhere/
 *
 * Copyright 2010, Thomas Billenstein
 * Licensed under the MIT license.
 * http://thomasbillenstein.com/jTweetsAnywhere/license.txt
 */
(function($)
{
 $.fn.jTweetsAnywhere = function(options)
 {
  // setup the default options
  var options = $.extend(
  {
   /**
    * The user's name who's tweet feed or list feed is displayed. This
    * param is also used when a Twitter "Follow Button" is displayed. Usually
    * this param is a string, but can also be an array of strings. If an array
    * is supplied (and the params 'list' and 'searchParams' are null), a
    * combined feed of all users is displayed.
    *
    * Sample: 'tbillenstein' or ['twitterapi', '...', '...']
    */
   username: 'tbillenstein',
   /**
    * The name of a user's list where the tweet feed is generated from
    */
   list: null,
   /**
    * A single search param string or an array of search params, to be used in
    * a Twitter search call. All Twitter Search Params are supported
    * See here for the details:
    * http://apiwiki.twitter.com/Twitter-Search-API-Method%3A-search
    *
    * Sample: 'q=twitter' or ['q=twitter', 'geocode=48.856667,2.350833,30km']
    */
   searchParams: null,
   /**
    * The number of tweets shown in the tweet feed. If this param is 0, no feed
    * is displayed. For user or list feeds the maximum count is 20, for search
    * results the maximum count is 100.
    *
    * Unlike in previous releases, since 1.2.0 jTweetsAnywhere is based on a
    * tweets caching algorithm that will always deliver the requested count of
    * tweets accepting that this request can only be fullfilled by calling Twitter
    * more than once.
    *
    * IMPORTANT: Please always keep in mind, that the use of the Twitter API is
    * rate limited. Non-authenticated users are rated IP-based and you have only
    * 150 calls per hour available. Every retrieval of tweets counts and so does
    * for example hovering over a profile image to show the hovercard.
    * jTweetsAnywhere will always check the remaining count of free API calls before
    * actually calling Twitter to avoid black listing your visitor's IP.
    */
   count: 0,
   /**
    * A flag (true/false) that specifies whether to display a profile image in
    * tweets. If the param is set to null (the default value), a profile image
    * is displayed only if the feed represents a user's list or the result of a
    * Twitter search.
    *
    * THIS OPTION IS DEPRECATED. You should use showTweetFeed.showProfileImages
    * instead.
    */
   tweetProfileImagePresent: null,
   /**
    * Each tweet that is loaded from Twitter will pass the tweetFilter. if
    * the filter returns true, the tweet will be added to the tweets cache
    * otherwise it is ignored. The defaultTweetFilter alsways retruns true
    * but you can supply your own tweet filter to customize the tweet feed.
    */
   tweetFilter: defaultTweetFilter,
   /**
    * A flag (true/false) that specifies whether to display a Tweet Feed
    * or an object literal representing the configuration options for the
    * Tweet Feed. This flag works in conjunction with the count parameter:
    * - if count equals 0, no feed is displayed, ignoring showTweetFeed
    * - if count not equals 0 and showTweetFeed equals false, no feed
    *   is displayed
    * {
    *     expandHovercards: false,  // Boolean - Show Hovercards in expanded mode.
    *
    *     showTimestamp: true,   // A flag (true/false) that specifies whether to display a tweet's timestamp
    *          // or an object literal representing the configuration options for the
    *          // timestamp.
    *          // {
    *          //     refreshInterval: 0, // Time in seconds to be waited until the
    *          //       // timestamps of the displayed tweets get refreshed
       *         //        // 0 means no refreshing.
    *          // }
    *
    *     showSource: false,   // Boolean - Show info about the source of the tweet.
    *
    *     showGeoLocation: true,  // Boolean - Show geolocation info and link to Google maps.
    *
    *     showInReplyTo: true,   // Boolean - Show link to the "replied to" tweet (if available).
    *
    *     showProfileImages: null,  // A flag (true/false) that specifies whether to display a profile image in
    *          // tweets. If the param is set to null (the default value), a profile image
    *          // is displayed only if the feed represents a user's list or the result of a
    *          // Twitter search.
    *
    *     showUserScreenNames: null, // A flag (true/false/null) that specifies whether to display a username in
    *          // tweets. If the param is set to null (the default value), a username
    *          // is displayed only if the feed represents a user's list or the result of a
    *          // Twitter search.
    *
    *     showUserFullNames: false, // A flag (true/false/null) that specifies whether to display a user's full name
    *          // in tweets. If the param is set to null, a user's full name
    *          // is displayed only if the feed represents a user's list or the result of a
    *          // Twitter search.
    *
    *    includeRetweets: true,  // Boolean - Include native retweets in a user's tweet feed
    *
    *     paging:      // An object literal representing the configuration options for the
    *     {       // paging support, that specifies how more/earlier tweets can be loaded
    *         mode: "none"       // by using the supplied UI controls (more/next buttons, scrollbar).
    *     },                           // Accepted values for mode are: "none" | "more" | "prev-next" | "endless-scroll"
    *         // if mode equals "endless-scroll" you have to set the height of the tweet feed
    *         // element (.jta-tweet-list) in your CSS to get a scrollbar! You should also set
    *         // the "overflow" attribute to "auto".
    *
       *     autorefresh:     // An object literal representing the configuration options for the
       *    {       // autorefresh behaviour.
       *
       *         // IMPORTANT: Please always keep in mind, that using the Twitter API is rate
       *         // limited. Non-authenticated users are rated IP-based and you have only 150
       *         // calls per hour available. Every retrieval of tweets counts and so does for
       *         // example hovering over a profile image to show the hovercard. jTweetsAnywhere will
    *         // always check the remaining count of free API calls before actually calling
    *         // Twitter to avoid black listing your visitor's IP.
    *
    *          // However - choose your settings wisely to keep your visitors happy. An update
    *         // interval of 30 seconds on a feed that is updated averaged once per hour
    *         // does not make sense and is a total waste of remaining API calls!
    *
       *        mode: "none",            // Accepted values for mode are: "none" | "auto-insert" | "trigger-insert"
       *         // "none" (the default value) - disables the autorefresh feature
       *         // "auto-insert" - automatically insert the new tweets on top of the tweet feed
       *         // "trigger-insert" - if new tweets arrived, show or update a button that displays
       *         // the number of new tweets. These new tweets are inserted on top of the tweet
       *         // feed, if the user clicks on the button.
       *
       *        interval: 60,   // Time in seconds to be waited until the next request for new tweets. Minimum
       *         // value is 30.
       *
       *         duration: 3600   // Time in seconds for how long the autorefresh will be active. After
       *         // this period of time, autorefreshing will stop. A value of -1 means
       *         // autorefresh for ever.
       *    }
    * }
    */
   showTweetFeed: true,
   /**
    * A flag (true/false) that specifies whether to display a Twitter "Follow
    * Button".
    */
   showFollowButton: false,
   /**
    * A flag (true/false) that specifies whether to display a Twitter "Connect
    * Button" or an object literal representing the configuration options for
    * the "Tweet Box".
    * {
    *     size: 'medium'    // String - The size of the Connect Button. Valid values are: small, medium, large, xlarge
    * }
    */
   showConnectButton: false,
   /**
    * A flag (true/false) that specifies whether to display Login Infos.
    */
   showLoginInfo: false,
   /**
    * A flag (true/false) that specifies whether to display a Twitter "Tweet
    * Box" or an object literal representing the configuration options for
    * the "Tweet Box".
    * {
    *     counter: true,    // Boolean - Display a counter in the Tweet Box for counting characters
    *     width: 515,     // Number - The width of the Tweet Box in pixels
    *     height: 65,     // Number - The height of the Tweet Box in pixels
    *     label: "What's happening", // String - The text above the Tweet Box, a call to action
    *     defaultContent: <none>,  // String - Pre-populated text in the Tweet Box. Useful for an @mention, a #hashtag, a link, etc.
    *     onTweet: <none>    // Function - Specify a listener for when a tweet is sent from the Tweet Box. The listener receives two arguments: a plaintext tweet and an HTML tweet
    * }
    */
   showTweetBox: false,
   /**
    * A decorator is a function that is responsible for constructing a certain
    * element of the widget. Most of the decorators return a HTML string.
    * Exceptions are the mainDecorator, which defines the basic sequence of
    * the widget's components, plus the linkDecorator, the usernameDecorator
    * and the hashtagDecorator which return the string that is supplied as a
    * function param, enriched with the HTML tags.
    *
    * For details, see the implementations of the default decorators. Each
    * default decorator can be overwritten by your own implementation.
    */
   mainDecorator: defaultMainDecorator,
   tweetFeedDecorator: defaultTweetFeedDecorator,
   tweetDecorator: defaultTweetDecorator,
   tweetProfileImageDecorator: defaultTweetProfileImageDecorator,
   tweetBodyDecorator: defaultTweetBodyDecorator,
   tweetUsernameDecorator: defaultTweetUsernameDecorator,
   tweetTextDecorator: defaultTweetTextDecorator,
   tweetAttributesDecorator: defaultTweetAttributesDecorator,
   tweetTimestampDecorator: defaultTweetTimestampDecorator,
   tweetSourceDecorator: defaultTweetSourceDecorator,
   tweetGeoLocationDecorator: defaultTweetGeoLocationDecorator,
   tweetInReplyToDecorator: defaultTweetInReplyToDecorator,
   tweetRetweeterDecorator: defaultTweetRetweeterDecorator,
   tweetFeedControlsDecorator: defaultTweetFeedControlsDecorator,
   tweetFeedControlsMoreBtnDecorator: defaultTweetFeedControlsMoreBtnDecorator,
   tweetFeedControlsPrevBtnDecorator: defaultTweetFeedControlsPrevBtnDecorator,
   tweetFeedControlsNextBtnDecorator: defaultTweetFeedControlsNextBtnDecorator,
   tweetFeedAutorefreshTriggerDecorator: defaultTweetFeedAutorefreshTriggerDecorator,
   tweetFeedAutorefreshTriggerContentDecorator: defaultTweetFeedAutorefreshTriggerContentDecorator,
   connectButtonDecorator: defaultConnectButtonDecorator,
   loginInfoDecorator: defaultLoginInfoDecorator,
   loginInfoContentDecorator: defaultLoginInfoContentDecorator,
   followButtonDecorator: defaultFollowButtonDecorator,
   tweetBoxDecorator: defaultTweetBoxDecorator,
   linkDecorator: defaultLinkDecorator,
   usernameDecorator: defaultUsernameDecorator,
   hashtagDecorator: defaultHashtagDecorator,
   loadingDecorator: defaultLoadingDecorator,
   errorDecorator: defaultErrorDecorator,
   noDataDecorator: defaultNoDataDecorator,
   /**
    * Formatters are currently used for date format processing only.
    *
    * The tweetTimestampFormatter formats the tweet's timestamp to be shown
    * in the tweet attributes section
    *
    * For details, see the implementation of the defaultTweetTimestampFormatter.
    */
   tweetTimestampFormatter : defaultTweetTimestampFormatter,
   /**
    * The tweetTimestampTooltipFormatter formats the tweet's timestamp to be shown
    * in the tooltip when hovering over the timestamp link.
    */
   tweetTimestampTooltipFormatter : defaultTweetTimestampTooltipFormatter,
   /**
    * A visualizer is a function that is responsible for adding one or more
    * elements to the DOM and thereby making them visible to the user.
    * A visualizer might also be responsible to do the opposite effect:
    * To remove one or more elements from the DOM.
    *
    * The tweetVisualizer gets called each time a tweet element should be
    * appended or prepended to the tweet feed element.
    *
    * For details, see the implementation of the defaultTweetVisualizer.
    *
    * Each default visualizer can be overwritten by your own implementation.
    */
   tweetVisualizer: defaultTweetVisualizer,
   /**
    * The loadingIndicatorVisualizer gets called each time data is retrieved
    * from Twitter to visualize the loading indicator. This visualizer is also
    * used to hide the loading indicator.
    *
    * For details, see the implementation of the defaultLoadingIndicatorVisualizer.
    */
   loadingIndicatorVisualizer: defaultLoadingIndicatorVisualizer,
   /**
    * The autorefreshTriggerVisualizer will be called if the autorefresh
    * trigger should be visualized or hidden.
    *
    * For details, see the implementation of the autorefreshTriggerVisualizer.
    */
   autorefreshTriggerVisualizer: defaultAutorefreshTriggerVisualizer,
   /**
    * An event handler is a function that gets called whenever the event you
    * are interested in, occurs.
    *
    * The onDataRequest event handler will be called immediatly before calling
    * Twitter to retrieve new data and gives you the opportunity to deny
    * the call by returning false from the function.
    *
    * This feature might be used in conjunction with the paging feature,
    * especially when using the "endless-scroll" paging mode, to avoid the
    * exhaustion of remaining Twitter API calls, before the rate limit is
    * reached. The stats parameter contains statistical infos and counters
    * that you can examine to base your decision whether to return true or
    * false.
    */
   onDataRequestHandler: defaultOnDataRequestHandler,
   /**
    * The onRateLimitData event handler is called each time
    * jTweetsAnywhere retrieved the rate limit data from Twitter. The actual
    * rate limit data is contained in the stats object.
    */
   onRateLimitDataHandler: defaultOnRateLimitDataHandler,
  
   //]init[ added onComplete Event
   onComplete: defaultOnComplete,
   _tweetFeedConfig:
   {
    expandHovercards: false,
    showTimestamp:
    {
     refreshInterval: 0
    },
    showSource: false,
    showGeoLocation: true,
    showInReplyTo: true,
    showProfileImages: null,
    showUserScreenNames: null,
    showUserFullNames: false,
    includeRetweets: true,
    paging:
    {
     mode: "none",
     _limit: 0,
     _offset: 0
    },
    autorefresh:
    {
     mode: "none",
     interval: 60,
     duration: 3600,
     _startTime: null,
     _triggerElement: null
    },
    _pageParam: 0,
    _maxId: null,
    _recLevel: 0,
    _noData: false,
    _clearBeforePopulate: false
   },
   _tweetBoxConfig:
   {
    counter: true,
    width: 515,
    height: 65,
    label: "What's happening?",
    defaultContent: '',
    onTweet: function(textTweet, htmlTweet) {}
   },
   _connectButtonConfig:
   {
    size: "medium"
   },
   _baseSelector: null,
   _baseElement: null,
   _tweetFeedElement: null,
   _tweetFeedControlsElement: null,
   _followButtonElement: null,
   _loginInfoElement: null,
   _connectButtonElement: null,
   _tweetBoxElement: null,
   _loadingIndicatorElement: null,
   _noDataElement: null,
   _tweetsCache: [],
   _autorefreshTweetsCache: [],
   _stats:
   {
    dataRequestCount: 0,
    rateLimitPreventionCount: 0,
    rateLimit:
    {
     remaining_hits: 150,
     hourly_limit: 150
    }
   }
  }, options);
  // no main decorator? nothing to do!
  if (!options.mainDecorator)
  {
   return;
  }
  options._baseSelector = this.selector;
  // if username is an array, create the search query and flatten username
  if (typeof(options.username) != 'string')
  {
   if (!options.searchParams)
   {
    options.searchParams = ['q=from:' + options.username.join(" OR from:")];
   }
   options.username = options.username[0];
  }
  // if showTweetFeed is not set to a boolean value, we expect the configuration of
  // the tweet feed
  if (typeof(options.showTweetFeed) == 'object')
  {
   $.extend(true, options._tweetFeedConfig, options.showTweetFeed);
  }
  // if showTweetBox is not set to a boolean value, we expect the configuration of
  // the TweetBox
  if (typeof(options.showTweetBox) == 'object')
  {
   options._tweetBoxConfig = options.showTweetBox;
   options.showTweetBox = true;
  }
  // if showConnectButton is not set to a boolean value, we expect the
  // configuration of the Connect Button
  if (typeof(options.showConnectButton) == 'object')
  {
   options._connectButtonConfig = options.showConnectButton;
   options.showConnectButton = true;
  }
  // to be compatible, check the deprecated option 'tweetProfileImagePresent'
  if (options._tweetFeedConfig.showProfileImages == null)
  {
   options._tweetFeedConfig.showProfileImages = options.tweetProfileImagePresent;
  }
  // if _tweetFeedConfig.showProfileImages is not set to a boolean value,
  // we decide to show a profile image if the feed represents a user's
  // list or the results of a Twitter search
  if (options._tweetFeedConfig.showProfileImages == null)
  {
   options._tweetFeedConfig.showProfileImages = (options.list || options.searchParams) && options.tweetProfileImageDecorator;
  }
  // if _tweetFeedConfig.showUserScreenNames is not set to a boolean value,
  // we decide to show a username if the feed represents a user's
  // list or the results of a Twitter search or a tweet is a native retweet
  if (options._tweetFeedConfig.showUserScreenNames == null)
  {
   if (options.list || options.searchParams)
   {
    options._tweetFeedConfig.showUserScreenNames = true;
   }
   if (!options.tweetUsernameDecorator)
   {
    options._tweetFeedConfig.showUserScreenNames = false;
   }
  }
  // if _tweetFeedConfig.showUserFullNames is not set to a boolean value,
  // we decide to show a user's full name if the feed represents a user's
  // list or the results of a Twitter search or a tweet is a native retweet
  if (options._tweetFeedConfig.showUserFullNames == null)
  {
   if (options.list || options.searchParams)
   {
    options._tweetFeedConfig.showUserFullNames = true;
   }
   if (!options.tweetUsernameDecorator)
   {
    options._tweetFeedConfig.showUserFullNames = false;
   }
  }
  options.count = validateRange(options.count, 0, options.searchParams ? 100 : 20);
  options._tweetFeedConfig.autorefresh.interval = Math.max(30, options._tweetFeedConfig.autorefresh.interval);
  options._tweetFeedConfig.paging._offset = 0;
  options._tweetFeedConfig.paging._limit = options.count;
  // internally, the decision of what parts of a widget are to be
  // displayed is based on the existence of the decorators
  if (options.count == 0 || !options.showTweetFeed)
  {
   options.tweetFeedDecorator = null;
   options.tweetFeedControlsDecorator = null;
  }
  if (options._tweetFeedConfig.paging.mode == 'none')
  {
   options.tweetFeedControlsDecorator = null;
  }
  if (!options.showFollowButton)
  {
   options.followButtonDecorator = null;
  }
  if (!options.showTweetBox)
  {
   options.tweetBoxDecorator = null;
  }
  if (!options.showConnectButton)
  {
   options.connectButtonDecorator = null;
  }
  if (!options.showLoginInfo)
  {
   options.loginInfoDecorator = null;
  }
  if (!options._tweetFeedConfig.showTimestamp)
  {
   options.tweetTimestampDecorator = null;
  }
  if (!options._tweetFeedConfig.showSource)
  {
   options.tweetSourceDecorator = null;
  }
  if (!options._tweetFeedConfig.showGeoLocation)
  {
   options.tweetGeoLocationDecorator = null;
  }
  if (!options._tweetFeedConfig.showInReplyTo)
  {
   options.tweetInReplyToDecorator = null;
  }
  // setup ajax
  $.ajaxSetup({ cache: true });
  return this.each(function()
  {
   // the DOM element, where to display the widget
   options._baseElement = $(this);
   // create the widget's necessary sub DOM elements
   options._tweetFeedElement = options.tweetFeedDecorator ? $(options.tweetFeedDecorator(options)) : null;
   options._tweetFeedControlsElement = options.tweetFeedControlsDecorator ? $(options.tweetFeedControlsDecorator(options)) : null;
   options._followButtonElement = options.followButtonDecorator ? $(options.followButtonDecorator(options)) : null;
   options._tweetBoxElement = options.tweetBoxDecorator ? $(options.tweetBoxDecorator(options)) : null;
   options._connectButtonElement = options.connectButtonDecorator ? $(options.connectButtonDecorator(options)): null;
   options._loginInfoElement = options.loginInfoDecorator ? $(options.loginInfoDecorator(options)) : null;
   // add the widget to the DOM
   options.mainDecorator(options);
   populateTweetFeed(options);
   populateAnywhereControls(options);
   // bind event handlers to support paging
   bindEventHandlers(options);
   // install autorefresh support
   options._tweetFeedConfig.autorefresh._startTime = new Date().getTime();
   startAutorefresh(options);
   startTimestampRefresh(options);
  });
 };
 defaultMainDecorator = function(options)
 {
  // defines the default sequence of the widget's elements
  if (options._tweetFeedElement)
  {
   options._baseElement.append(options._tweetFeedElement);
  }
  if (options._tweetFeedControlsElement)
  {
   options._baseElement.append(options._tweetFeedControlsElement);
  }
  if (options._connectButtonElement)
  {
   options._baseElement.append(options._connectButtonElement);
  }
  if (options._loginInfoElement)
  {
   options._baseElement.append(options._loginInfoElement);
  }
  if (options._followButtonElement)
  {
   options._baseElement.append(options._followButtonElement);
  }
  if (options._tweetBoxElement)
  {
   options._baseElement.append(options._tweetBoxElement);
  }
 };
 defaultTweetFeedControlsDecorator = function(options)
 {
  // the default tweet feed's paging controls
  var html = '';
  if (options._tweetFeedConfig.paging.mode == 'prev-next')
  {
   if (options.tweetFeedControlsPrevBtnDecorator)
   {
    html += options.tweetFeedControlsPrevBtnDecorator(options);
   }
   if (options.tweetFeedControlsNextBtnDecorator)
   {
    html += options.tweetFeedControlsNextBtnDecorator(options);
   }
  }
  else if (options._tweetFeedConfig.paging.mode == 'endless-scroll')
  {
   // nothing to do here atm
  }
  else
  {
   if (options.tweetFeedControlsMoreBtnDecorator)
   {
    html += options.tweetFeedControlsMoreBtnDecorator(options);
   }
  }
  return '<div class="jta-tweet-list-controls">' + html + '</div>';
 };
 defaultTweetFeedControlsMoreBtnDecorator = function(options)
 {
  return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-more">' + 'More' + '</span>';
 };
 defaultTweetFeedControlsPrevBtnDecorator = function(options)
 {
  return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-prev">' + 'Prev' + '</span>';
 };
 defaultTweetFeedControlsNextBtnDecorator = function(options)
 {
  return '<span class="jta-tweet-list-controls-button jta-tweet-list-controls-button-next">' + 'Next' + '</span>';
 };
 defaultTweetFeedAutorefreshTriggerDecorator = function(count, options)
 {
  var html = '';
  if (options.tweetFeedAutorefreshTriggerContentDecorator)
  {
   html = options.tweetFeedAutorefreshTriggerContentDecorator(count, options);
  }
  return '<li class="jta-tweet-list-autorefresh-trigger">' + html + '</li>';
 };
 defaultTweetFeedAutorefreshTriggerContentDecorator = function(count, options)
 {
  var content = '' + count + ' new ' + (count > 1 ? ' tweets' : ' tweet');
  return '<span class="jta-tweet-list-autorefresh-trigger-content">' + content + '</span>';
 };
 defaultTweetFeedDecorator = function(options)
 {
  // the default placeholder for the tweet feed is an unordered list
  return '<div class="tweetContainer"></div>';
 };
 defaultTweetDecorator = function(tweet, options)
 {
  // the default tweet is made of the optional user's profile image and the
  // tweet body inside a list item element
  var html = '';
  if (options._tweetFeedConfig.showProfileImages)
  {
   html += options.tweetProfileImageDecorator(tweet, options);
  }
  if (options.tweetBodyDecorator)
  {
   html += options.tweetBodyDecorator(tweet, options);
  }
  html += '<div class="jta-clear">&nbsp;</div>';
  return '<div class="js-tweet-box"><div class="js-tweet-box-box">' + html + '</div></div>';
 };
 defaultTweetProfileImageDecorator = function(tweet, options)
 {
  // if tweet is a native retweet, use the retweet's profile
  var t = tweet.retweeted_status || tweet;
  // the default profile image decorator simply adds a link to the user's Twitter profile
  var screenName = t.user ? t.user.screen_name : false || t.from_user;
  var imageUrl = t.user ? t.user.profile_image_url : false || t.profile_image_url;
  var html =
   '<a class="jta-tweet-profile-image-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
   '<img src="' + imageUrl + '" alt="' + screenName + '"' +
   (isAnywherePresent() ? '' : (' title="' + screenName + '"')) +
   '/>' +
   '</a>';
  return '<div class="jta-tweet-profile-image">' + html + '</div>';
 };
 defaultTweetBodyDecorator = function(tweet, options)
 {
  // the default tweet body contains the tweet text and the tweet's creation date
  var html = '';
  if (options.tweetTextDecorator)
  {
   html += options.tweetTextDecorator(tweet, options);
  }
  if (options.tweetAttributesDecorator)
  {
   html += options.tweetAttributesDecorator(tweet, options);
  }
  return html;
 };
 defaultTweetTextDecorator = function(tweet, options)
 {
  var tweetText = tweet.text;
  // if usernames should be visible and tweet is a native retweet, use
  // the original tweet text
  if (tweet.retweeted_status &&
   (
    options._tweetFeedConfig.showUserScreenNames ||
    options._tweetFeedConfig.showUserScreenNames == null ||
    options._tweetFeedConfig.showUserFullNames ||
    options._tweetFeedConfig.showUserFullNames == null
   )
  )
  {
   tweetText = tweet.retweeted_status.text;
  }
  // the default tweet text decorator optionally marks links, @usernames,
  // and #hashtags
  if (options.linkDecorator)
  {
   tweetText = options.linkDecorator(tweetText, options);
  }
  if (options.usernameDecorator)
  {
   tweetText = options.usernameDecorator(tweetText, options);
  }
  if (options.hashtagDecorator)
  {
   tweetText = options.hashtagDecorator(tweetText, options);
  }
  if (options._tweetFeedConfig.showUserScreenNames ||
   options._tweetFeedConfig.showUserFullNames ||
   tweet.retweeted_status &&
   (
    options._tweetFeedConfig.showUserScreenNames == null ||
    options._tweetFeedConfig.showUserFullNames == null
   )
  )
  {
   tweetText = options.tweetUsernameDecorator(tweet, options) + ' ' + tweetText;
  }
  return '<span class="js-tweet">' + tweetText + '</span>';
 };
 defaultTweetUsernameDecorator = function(tweet, options)
 {
  // if tweet is a native retweet, use the retweet's profile
  var t = tweet.retweeted_status || tweet;
  var screenName = t.user ? t.user.screen_name : false || t.from_user;
  var fullName = t.user ? t.user.name : null;
  var htmlScreenName;
  if (screenName && (options._tweetFeedConfig.showUserScreenNames || (options._tweetFeedConfig.showUserScreenNames == null && tweet.retweeted_status)))
  {
   htmlScreenName =
    '<span class="jta-tweet-user-screen-name">' +
    '<a class="jta-tweet-user-screen-name-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
    screenName +
    '</a>' +
    '</span>';
  }
  var htmlFullName;
  if (fullName && (options._tweetFeedConfig.showUserFullNames || (options._tweetFeedConfig.showUserFullNames == null && tweet.retweeted_status)))
  {
   htmlFullName =
    '<span class="jta-tweet-user-full-name">' +
    (htmlScreenName ? ' (' : '') +
    '<a class="jta-tweet-user-full-name-link" href="http://twitter.com/' + screenName + '" name="' + screenName + '" target="_blank">' +
    fullName +
    '</a>' +
    (htmlScreenName ? ')' : '') +
    '</span>';
  }
  var html = "";
  if (htmlScreenName)
  {
   html += htmlScreenName;
  }
  if (htmlFullName)
  {
   if (htmlScreenName)
   {
    html += ' ';
   }
   html += htmlFullName;
  }
  if (htmlScreenName || htmlFullName)
  {
   html =
    '<span class="jta-tweet-user-name">' +
    (tweet.retweeted_status ? 'RT ' : '') +
    html +
    '</span>';
  }
  return html;
 };
 defaultTweetAttributesDecorator = function(tweet, options)
 {
  var html = '';
  if (options.tweetTimestampDecorator ||
   options.tweetSourceDecorator ||
   options.tweetGeoLocationDecorator ||
   options.tweetInReplyToDecorator ||
   (tweet.retweeted_status && options.tweetRetweeterDecorator)
  )
  {
   html += '';
   if (options.tweetTimestampDecorator)
   {
    html += options.tweetTimestampDecorator(tweet, options);
   }
   if (options.tweetSourceDecorator)
   {
    html += options.tweetSourceDecorator(tweet, options);
   }
   if (options.tweetGeoLocationDecorator)
   {
    html += options.tweetGeoLocationDecorator(tweet, options);
   }
   if (options.tweetInReplyToDecorator)
   {
    html += options.tweetInReplyToDecorator(tweet, options);
   }
   if (tweet.retweeted_status && options.tweetRetweeterDecorator)
   {
    html += options.tweetRetweeterDecorator(tweet, options);
   }
  }
  return html;
 };
 defaultTweetTimestampDecorator = function(tweet, options)
 {
  // the default tweet timestamp decorator does a little bit of Twitter like formatting.
  // if tweet is a native retweet, use the retweet's timestamp
  var tw = tweet.retweeted_status || tweet;
  // reformat timestamp from Twitter, so IE is happy
  var createdAt = formatDate(tw.created_at);
  // format the timestamp by the tweetTimestampFormatter
  var tweetTimestamp = options.tweetTimestampFormatter(createdAt);
  var tweetTimestampTooltip = options.tweetTimestampTooltipFormatter(createdAt);
  var screenName = tw.user ? tw.user.screen_name : false || tw.from_user;
  var html =
   '<span class="js-date"> ' + tweetTimestamp + '</span>';
  return html;
 };
 defaultTweetTimestampTooltipFormatter = function(timeStamp)
 {
  var d = new Date(timeStamp);
  return d.toLocaleString();
 };
 defaultTweetTimestampFormatter = function(timeStamp)
 {
  var now = new Date();
  var diff = parseInt((now.getTime() - Date.parse(timeStamp)) / 1000);
  var tweetTimestamp = '';
  if (diff < 60)
  {
   tweetTimestamp += ' vor ' + diff + ' Sekunden';
  }
  else if (diff < 3600)
  {
   var t = parseInt((diff + 30) / 60);
   tweetTimestamp += ' vor ' + t + ' Minuten';
  }
  else if (diff < 86400)
  {
   var t = parseInt((diff + 1800) / 3600);
   tweetTimestamp += ' vor ' + t + ' Stunden';
  }
  else
  {
   var d = new Date(timeStamp);
   var period = 'AM';
   var hours = d.getHours();
   if (hours > 12)
   {
    hours -= 12;
    period = 'PM';
   }
   var mins = d.getMinutes();
   var minutes = (mins < 10 ? '0' : '') + mins;
   var monthName = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
   tweetTimestamp += monthName[d.getMonth()] + ' ' + d.getDate();
   if (d.getFullYear() < now.getFullYear())
   {
    tweetTimestamp += ', ' + d.getFullYear();
   }
   var t = parseInt((diff + 43200) / 86400);
   tweetTimestamp += ' (' + t + ' day' + (t == 1 ? '' : 's') + ' ago)';
  }
  return tweetTimestamp;
 };
 exTimestampFormatter = function(timeStamp)
 {
  var diff = parseInt((new Date().getTime() - Date.parse(timeStamp)) / 1000);
  var tweetTimestamp = '';
  if (diff < 60)
  {
   tweetTimestamp += 'less than a minute ago';
  }
  else if (diff < 3600)
  {
   var t = parseInt((diff + 30) / 60);
   tweetTimestamp += t + ' minute' + (t == 1 ? '' : 's') + ' ago';
  }
  else if (diff < 86400)
  {
   var t = parseInt((diff + 1800) / 3600);
   tweetTimestamp += 'about ' + t + ' hour' + (t == 1 ? '' : 's') + ' ago';
  }
  else
  {
   var t = parseInt((diff + 43200) / 86400);
   tweetTimestamp += 'about ' + t + ' day' + (t == 1 ? '' : 's') + ' ago';
   var d = new Date(timeStamp);
   var period = 'AM';
   var hours = d.getHours();
   if (hours > 12)
   {
    hours -= 12;
    period = 'PM';
   }
   var mins = d.getMinutes();
   var minutes = (mins < 10 ? '0' : '') + mins;
   tweetTimestamp += ' ('  + hours + ':' + minutes + ' ' + period + ' ' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ')';
  }
  return tweetTimestamp;
 };
 defaultTweetSourceDecorator = function(tweet, options)
 {
  // if tweet is a native retweet, use the retweet's source
  var tw = tweet.retweeted_status || tweet;
  var source = tw.source.replace(/\&lt\;/gi,'<').replace(/\&gt\;/gi,'>').replace(/\&quot\;/gi,'"');
  var html =
   '<span class="jta-tweet-source">' +
   ' via ' +
   '<span class="jta-tweet-source-link">' +
   source +
   '</span>' +
   '</span>';
  return html;
 };
 defaultTweetGeoLocationDecorator = function(tweet, options)
 {
  var html = '';
  // if tweet is a native retweet, use the retweet's source
  var tw = tweet.retweeted_status || tweet;
  var q;
  if (tw.geo && tw.geo.coordinates)
  {
   q = tw.geo.coordinates.join();
  }
  else if (tw.place && tw.place.full_name)
  {
   q = tw.place.full_name;
  }
  if (q)
  {
   var location = 'here';
   if (tw.place && tw.place.full_name)
   {
    location = tw.place.full_name;
   }
   var link = 'http://maps.google.com/maps?q=' + q;
   html =
    '<span class="jta-tweet-location">' +
    ' from ' +
    '<a class="jta-tweet-location-link" href="' + link + '" target="_blank">' +
    location +
    '</a>' +
    '</span>';
  }
  return html;
 };
 defaultTweetInReplyToDecorator = function(tweet, options)
 {
  // if tweet is a native retweet, use the retweet's source
  var tw = tweet.retweeted_status || tweet;
  var html = '';
  if (tw.in_reply_to_status_id && tw.in_reply_to_screen_name)
  {
   html =
    '<span class="jta-tweet-inreplyto">' +
    ' ' +
    '<a class="jta-tweet-inreplyto-link" href="http://twitter.com/' + tw.in_reply_to_screen_name + '/status/' + tw.in_reply_to_status_id + '" target="_blank">' +
    'in reply to ' + tw.in_reply_to_screen_name +
    '</a>' +
    '</span>';
  }
  return html;
 };
 defaultTweetRetweeterDecorator = function(tweet, options)
 {
  var html = '';
  if (tweet.retweeted_status)
  {
   var screenName = tweet.user ? tweet.user.screen_name : false || tweet.from_user;
   var rtc = (tweet.retweeted_status.retweet_count || 0) - 1;
   var link =
    '<a class="jta-tweet-retweeter-link" href="http://twitter.com/' + screenName + '" target="_blank">' +
    screenName +
    '</a>';
   var rtcount = ' and ' + rtc + (rtc > 1 ? ' others' : ' other');
   html =
    '<br/>' +
    '<span class="jta-tweet-retweeter">' +
    'Retweeted by ' + link +
    (rtc > 0 ? rtcount : '') +
    '</span>';
  }
  return html;
 };
 defaultConnectButtonDecorator = function(options)
 {
  // the default placeholder for the @Anywhere ConnectButton
  return '<div class="jta-connect-button"></div>';
 };
 defaultLoginInfoDecorator = function(options)
 {
  // the default placeholder for the LoginInfo
  return '<div class="jta-login-info"></div>';
 };
 defaultLoginInfoContentDecorator = function(options, T)
 {
  // the default markup of the LoginInfo content: the user's profile image, the
  // user's screen_name and a "button" to sign out
  var html = '';
  if (T.isConnected())
  {
   var screenName = T.currentUser.data('screen_name');
   var imageUrl = T.currentUser.data('profile_image_url');
   html =
    '<div class="jta-login-info-profile-image">' +
    '<a href="http://twitter.com/' + screenName + '" target="_blank">' +
    '<img src="' + imageUrl + '" alt="' + screenName + '" title="' + screenName + '"/>' +
    '</a>' +
    '</div>' +
    '<div class="jta-login-info-block">' +
    '<div class="jta-login-info-screen-name">' +
    '<a href="http://twitter.com/' + screenName + '" target="_blank">' + screenName + '</a>' +
    '</div>' +
    '<div class="jta-login-info-sign-out">' +
    'Sign out' +
    '</div>' +
    '</div>' +
    '<div class="jta-clear">&nbsp;</div>'
    ;
  }
  return html;
 };
 defaultFollowButtonDecorator = function(options)
 {
  // the default placeholder for the @Anywhere FollowButton
  return '<div class="jta-follow-button"></div>';
 };
 defaultTweetBoxDecorator = function(options)
 {
  // the default placeholder for the @Anywhere TweetBox
  return '<div class="jta-tweet-box"></div>';
 };
 defaultLinkDecorator = function(text, options)
 {
  // the regex to markup links
  return text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1" class="jta-tweet-a jta-tweet-link" target="_blank" rel="nofollow">$1<\/a>');
 };
 defaultUsernameDecorator = function(text, options)
 {
  // the regex to markup @usernames. if @Anywhere is present the task is left to
  // them
  return isAnywherePresent() ? text : text.replace(/@([a-zA-Z0-9_]+)/gi,'@<a href="http://twitter.com/$1" class="jta-tweet-a twitter-anywhere-user" target="_blank" rel="nofollow">$1<\/a>');
 };
 defaultHashtagDecorator = function(text, options)
 {
  // the regex to markup #hashtags
  return text.replace(/#([a-zA-Z0-9_]+)/gi,'<a href="http://search.twitter.com/search?q=%23$1" class="jta-tweet-a jta-tweet-hashtag" title="#$1" target="_blank" rel="nofollow">#$1<\/a>');
 };
 defaultLoadingDecorator = function(options)
 {
  // the default loading decorator simply says: loading ...
  return '<li class="jta-loading">loading ...</li>';
 };
 defaultErrorDecorator = function(errorText, options)
 {
  // the default error decorator shows the error message
  return '<li class="jta-error">ERROR: ' + errorText + '</li>';
 };
 defaultNoDataDecorator = function(options)
 {
  // the default no-data decorator simply says: No more data
  return '<li class="jta-nodata">No more data</li>';
 };
 defaultTweetFilter = function(tweet, options)
 {
  return true;
 };
 defaultTweetVisualizer = function(tweetFeedElement, tweetElement, inserter, options)
 {
  // insert (append/prepend) the tweetElement to the tweetFeedElement
  tweetFeedElement[inserter](tweetElement);
 };
 defaultLoadingIndicatorVisualizer = function(tweetFeedElement, loadingIndicatorElement, options, callback)
 {
  defaultVisualizer(tweetFeedElement, loadingIndicatorElement, 'append', 'fadeIn', 600, 'fadeOut', 200, callback);
 };
 defaultAutorefreshTriggerVisualizer = function(tweetFeedElement, triggerElement, options, callback)
 {
  defaultVisualizer(tweetFeedElement, triggerElement, 'prepend', 'slideDown', 600, 'fadeOut', 200, callback);
 };
 defaultVisualizer = function(container, element, inserter, effectIn, durationIn, effectOut, durationOut, callback)
 {
  // if param container is null element has to be removed from
  // the DOM, else element has to be inserted in container
  // if param callback is not null, the callback function must be called
  // in any case, if the visualizer is done
  var cb = function()
  {
   if (callback)
   {
    callback();
   }
  };
  if (container)
  {
   element.hide();
   container[inserter](element);
   element[effectIn](durationIn, cb);
  }
  else
  {
   element[effectOut](durationOut, function()
   {
    element.remove();
    cb();
   });
  }
 };
 defaultOnDataRequestHandler = function(stats, options)
 {
  return true;
 };
 defaultOnRateLimitDataHandler = function(stats, options)
 {
 };
 updateLoginInfoElement = function(options, T)
 {
  // update the content of the LoginInfo element
  if (options._loginInfoElement && options.loginInfoContentDecorator)
  {
   options._loginInfoElement.children().remove();
   options._loginInfoElement.append(options.loginInfoContentDecorator(options, T));
   $(options._baseSelector + ' .jta-login-info-sign-out').bind('click', function()
   {
    twttr.anywhere.signOut();
   });
  }
 };
 getFeedUrl = function(options, flPaging)
 {
  // create the Twitter API URL based on the configuration options
  var url = ('https:' == document.location.protocol ? 'https:' : 'http:');
  if (options.searchParams)
  {
   url += '//search.twitter.com/search.json?' +
    ((options.searchParams instanceof Array) ? options.searchParams.join('&') : options.searchParams) +
    '&rpp=100';
  }
  else if (options.list)
  {
   url += '//api.twitter.com/1/' + options.username + '/lists/' + options.list + '/statuses.json?per_page=20';
  }
  else
  {
   url += '//api.twitter.com/1/statuses/user_timeline.json?screen_name=' + options.username + '&count=20';
   if (options._tweetFeedConfig.includeRetweets)
    url += '&include_rts=true';
  }
  if (flPaging)
  {
   url +=
    (options._tweetFeedConfig._maxId ? '&max_id=' + options._tweetFeedConfig._maxId : '') +
    '&page=' + options._tweetFeedConfig._pageParam;
  }
  url += '&callback=?';
  return url;
 };
 isAnywherePresent = function()
 {
  // check, if @Anywhere is present
  return typeof(twttr) != 'undefined';
 };
 clearTweetFeed = function(options)
 {
  if (options._tweetFeedElement)
  {
   options._tweetFeedElement.empty();
  }
 };
 populateTweetFeed = function(options)
 {
  // if a tweet feed is to be displayed, get the tweets and show them
  if (options.tweetDecorator && options._tweetFeedElement)
  {
   getPagedTweets(options, function(tweets, options)
   {
    if (options._tweetFeedConfig._clearBeforePopulate)
    {
     clearTweetFeed(options);
    }
    hideLoadingIndicator(options, function()
    {
     // process the tweets
     $.each(tweets, function(idx, tweet)
     {
      // decorate the tweet and give it to the tweet visualizer
      options.tweetVisualizer(
       options._tweetFeedElement,
       $(options.tweetDecorator(tweet, options)),
       'append',
       options
      );
     });
    
    
     if (options._tweetFeedConfig._noData && options.noDataDecorator && !options._tweetFeedConfig._noDataElement)
     {
      options._tweetFeedConfig._noDataElement = $(options.noDataDecorator(options));
      options._tweetFeedElement.append(options._tweetFeedConfig._noDataElement);
     }
     if (options._tweetFeedConfig._clearBeforePopulate)
     {
      options._tweetFeedElement.scrollTop(0);
     }
     //]init[ Added Oncomplete Event
     options.onComplete(options);
    });
   });
  }
 };
 populateTweetFeed2 = function(options)
 {
  if (options._tweetFeedElement && options._autorefreshTweetsCache.length > 0)
  {
   if (options._tweetFeedConfig.autorefresh.mode == 'trigger-insert')
   {
    if (options._tweetFeedConfig.autorefresh._triggerElement)
    {
     if (options.tweetFeedAutorefreshTriggerContentDecorator)
     {
      options._tweetFeedConfig.autorefresh._triggerElement.html(
       options.tweetFeedAutorefreshTriggerContentDecorator(options._autorefreshTweetsCache.length, options)
      );
     }
    }
    else
    {
     if (options.tweetFeedAutorefreshTriggerDecorator)
     {
      options._tweetFeedConfig.autorefresh._triggerElement =
       $(options.tweetFeedAutorefreshTriggerDecorator(options._autorefreshTweetsCache.length, options));
      options._tweetFeedConfig.autorefresh._triggerElement.bind('click', function()
      {
       options.autorefreshTriggerVisualizer(
        null,
        options._tweetFeedConfig.autorefresh._triggerElement,
        options,
        function()
        {
         insertTriggerTweets(options);
        }
       );
       options._tweetFeedConfig.autorefresh._triggerElement = null;
      });
      options.autorefreshTriggerVisualizer(options._tweetFeedElement, options._tweetFeedConfig.autorefresh._triggerElement, options);
     }
    }
   }
   else
   {
    insertTriggerTweets(options);
   }
  }
 };
 insertTriggerTweets = function(options)
 {
  // populate the tweet feed with tweets from the autorefresh cache
  if (options.tweetDecorator && options._autorefreshTweetsCache.length > 0)
  {
   // process the autorefresh cache
   while (options._autorefreshTweetsCache.length > 0)
   {
    // get the last tweet and remove it from the autorefresh cache
    var tweet = options._autorefreshTweetsCache.pop();
    // put that tweet on top of the tweets cache
    options._tweetsCache.unshift(tweet);
    // adjust paging offset
    options._tweetFeedConfig.paging._offset++;
    // decorate the tweet and give it to the tweet visualizer
    options.tweetVisualizer(
     options._tweetFeedElement,
     $(options.tweetDecorator(tweet, options)),
     'prepend',
     options
    );
   }
  
   addHovercards(options);
  }
 };
 addHovercards = function(options)
 {
  if (isAnywherePresent())
  {
   // if @Anywhere is present, append Hovercards to @username and
   // profile images
   twttr.anywhere(function(T)
   {
    T(options._baseSelector + ' .jta-tweet-list').hovercards({expanded: options._tweetFeedConfig.expandHovercards});
    T(options._baseSelector + ' .jta-tweet-profile-image img').hovercards(
    {
     expanded: options._tweetFeedConfig.expandHovercards,
     username: function(node) { return node.alt; }
    });
    T(options._baseSelector + ' .jta-tweet-retweeter-link').hovercards(
    {
     expanded: options._tweetFeedConfig.expandHovercards,
     username: function(node) { return node.text; }
    });
    T(options._baseSelector + ' .jta-tweet-user-screen-name-link').hovercards(
    {
     expanded: options._tweetFeedConfig.expandHovercards,
     username: function(node) { return node.text; }
    });
    T(options._baseSelector + ' .jta-tweet-user-full-name-link').hovercards(
    {
     expanded: options._tweetFeedConfig.expandHovercards,
     username: function(node) { return node.name; }
    });
   });
  }
 
  //]init[ trigger OnComplete Event
  options.onComplete(options);
 };
 populateAnywhereControls = function(options)
 {
  if (isAnywherePresent())
  {
   twttr.anywhere(function(T)
   {
    // optionally add an @Anywhere TweetBox
    if (options.tweetBoxDecorator)
    {
     T(options._baseSelector + ' .jta-tweet-box').tweetBox(options._tweetBoxConfig);
    }
    // optionally add an @Anywhere FollowButton
    if (options.followButtonDecorator)
    {
     T(options._baseSelector + ' .jta-follow-button').followButton(options.username);
    }
    // optionally add an @Anywhere ConnectButton
    if (options.connectButtonDecorator)
    {
     var o = $.extend(
     {
      authComplete: function(user)
      {
       // display/update login infos on connect/signin event
       updateLoginInfoElement(options, T);
      },
      signOut: function()
      {
       // display/update login infos on signout event
       updateLoginInfoElement(options, T);
      }
     }, options._connectButtonConfig);
     T(options._baseSelector + ' .jta-connect-button').connectButton(o);
     // display/update login infos
     updateLoginInfoElement(options, T);
    }
   });
  }
 };
 bindEventHandlers = function(options)
 {
  if (options.tweetFeedControlsDecorator)
  {
   if (options._tweetFeedConfig.paging.mode == 'prev-next')
   {
    $(options._baseSelector + ' .jta-tweet-list-controls-button-prev').bind('click', function()
    {
     if (!isLoading(options) && options._tweetFeedConfig.paging._offset > 0)
     {
      prevPage(options, true);
     }
    });
    $(options._baseSelector + ' .jta-tweet-list-controls-button-next').bind('click', function()
    {
     if (!isLoading(options))
     {
      nextPage(options, true);
     }
    });
   }
   else if (options._tweetFeedConfig.paging.mode == 'endless-scroll')
   {
    options._tweetFeedElement.bind("scroll", function()
    {
        if (!isLoading(options) && ($(this)[0].scrollHeight - $(this).scrollTop() == $(this).outerHeight()))
        {
         nextPage(options, false);
        }
    });
   }
   else
   {
    $(options._baseSelector + ' .jta-tweet-list-controls-button-more').bind('click', function()
    {
     if (!isLoading(options))
     {
      nextPage(options, false);
     }
    });
   }
  }
 };
 nextPage = function(options, flClear)
 {
  doPage(options, flClear, Math.min(options._tweetFeedConfig.paging._offset + options._tweetFeedConfig.paging._limit, options._tweetsCache.length));
 };
 prevPage = function(options, flClear)
 {
  doPage(options, flClear, Math.max(0, options._tweetFeedConfig.paging._offset - options._tweetFeedConfig.paging._limit));
 };
 doPage = function(options, flClear, newOffset)
 {
  options._tweetFeedConfig.paging._offset = newOffset;
  options._tweetFeedConfig._clearBeforePopulate = flClear;
  populateTweetFeed(options);
 };
 startAutorefresh = function(options)
 {
 
  if (options._tweetFeedConfig.autorefresh.mode != 'none' &&
   options._tweetFeedConfig.paging.mode != 'prev-next' &&
   options._tweetFeedConfig.autorefresh.duration != 0 &&
   (
    options._tweetFeedConfig.autorefresh.duration < 0 ||
    (new Date().getTime() - options._tweetFeedConfig.autorefresh._startTime) <= options._tweetFeedConfig.autorefresh.duration * 1000
   )
  )
  {
   window.setTimeout(function() { processAutorefresh(options); }, options._tweetFeedConfig.autorefresh.interval * 1000);
  }
 
 };
 stopAutorefresh = function(options)
 {
  options._tweetFeedConfig.autorefresh.duration = 0;
 };
 processAutorefresh = function(options)
 {
  if (options._tweetFeedConfig.autorefresh.duration != 0)
  {
   // load the data ...
   getRateLimitedData(options, true, getFeedUrl(options, false), function(data, options)
   {
    // reverse the sequence of the autorefresh tweets ...
    var tweets = (data.results || data).slice(0);
    tweets.reverse();
    // ...then process them
    $.each(tweets, function(idx, tweet)
    {
     // if this tweet is already in the standard tweets cache, ignore
     if (!isTweetInCache(tweet, options))
     {
      // optionally filter tweet ...
      if (options.tweetFilter(tweet, options))
      {
       // ... then put it to the top of the autorefresh cache
       options._autorefreshTweetsCache.unshift(tweet);
      }
     }
    });
    populateTweetFeed2(options);
   });
   // restart autorefresh
   startAutorefresh(options);
  }
 };
 startTimestampRefresh = function(options)
 {
  if (
   options.tweetTimestampDecorator &&
   typeof(options._tweetFeedConfig.showTimestamp) == 'object' &&
   options._tweetFeedConfig.showTimestamp.refreshInterval > 0
  )
  {
   window.setTimeout(function() { processTimestampRefresh(options); }, options._tweetFeedConfig.showTimestamp.refreshInterval * 1000);
  }
 };
 processTimestampRefresh = function(options)
 {
  $.each(options._tweetFeedElement.find('.jta-tweet-timestamp-link'), function(idx, element)
  {
   var dataTimestamp = $(element).attr('data-timestamp');
   $(element).html(options.tweetTimestampFormatter(dataTimestamp));
  });
  startTimestampRefresh(options);
 };
 isTweetInCache = function(tweet, options)
 {
  var l = options._tweetsCache.length;
  for (var i = 0; i < l; i++)
  {
   if (tweet.id == options._tweetsCache[i].id)
   {
    return true;
   }
  }
  return false;
 };
 showLoadingIndicator = function(options)
 {
  if (options._tweetFeedElement && options.loadingDecorator && !options._loadingIndicatorElement)
  {
   options._loadingIndicatorElement = $(options.loadingDecorator(options));
   options.loadingIndicatorVisualizer(options._tweetFeedElement, options._loadingIndicatorElement, options, null);
   options._tweetFeedElement.scrollTop(1000000);
  }
 };
 hideLoadingIndicator = function(options, callback)
 {
  if (options._loadingIndicatorElement)
  {
   options.loadingIndicatorVisualizer(null, options._loadingIndicatorElement, options, callback);
   options._loadingIndicatorElement = null;
  }
  else
  {
   if (callback)
   {
    callback();
   }
  }
 };
 isLoading = function(options)
 {
  return options._loadingIndicatorElement != null;
 };
    formatDate = function(dateStr)
 {
     return dateStr.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3');
    };
 validateRange = function(num, lo, hi)
 {
  if (num < lo)
   num = lo;
  if (num > hi)
   num = hi;
  return num;
 };
    showError = function(options, errorText)
 {
     if (options.errorDecorator && options._tweetFeedElement)
     {
      options._tweetFeedElement.append(options.errorDecorator(errorText, options));
     }
    };
    getPagedTweets = function(options, callback)
    {
     options._tweetFeedConfig._recLevel = 0;
     getRecPagedTweets(options, options._tweetFeedConfig.paging._offset, options._tweetFeedConfig.paging._limit, callback);
 };
    getRecPagedTweets = function(options, offset, limit, callback)
 {
     ++options._tweetFeedConfig._recLevel;
     if (offset + limit <= options._tweetsCache.length ||
      options._tweetFeedConfig._recLevel > 3 ||
      options._tweetFeedConfig._noData
     )
  {
      // if the requested data is already cached or the max. no. of
      // consecutive API calls is reached, use the records
      if (offset + limit > options._tweetsCache.length)
      {
       limit = Math.max(0, options._tweetsCache.length - offset);
      }
   var tweets = [];
   for (var i = 0; i < limit; i++)
   {
    tweets[i] = options._tweetsCache[offset + i];
   }
   callback(tweets, options);
  }
     else
  {
      // ... if not, load the data, fill the cache and try again
      ++options._tweetFeedConfig._pageParam;
      getRateLimitedData(options, false, getFeedUrl(options, true), function(data, options)
      {
       var tweets = data.results || data;
       if (tweets.length == 0)
       {
        options._tweetFeedConfig._noData = true;
       }
       else
    {
        $.each(tweets, function(idx, tweet)
        {
         // Snowflake support: just update ids that are currently used
         if (tweet.id_str) { tweet.id = tweet.id_str; }
         if (tweet.in_reply_to_status_id_str) { tweet.in_reply_to_status_id = tweet.in_reply_to_status_id_str; }
         // save the first tweet id for subsequent paging requests
         if (!options._tweetFeedConfig._maxId)
         {
          options._tweetFeedConfig._maxId = tweet.id;
         }
         // optionally filter tweet ...
         if (options.tweetFilter(tweet, options))
         {
          // then put it into the cache
          options._tweetsCache.push(tweet);
         }
        });
    }
       getRecPagedTweets(options, offset, limit, callback);
      });
  }
 };
 getRateLimitedData = function(options, flAutorefresh, url, callback)
 {
  getRateLimit(options, function(rateLimit)
  {
   if (rateLimit && rateLimit.remaining_hits <= 0)
   {
    options._stats.rateLimitPreventionCount++;
    hideLoadingIndicator(options, null);
    return;
   }
   getData(options, flAutorefresh, url, callback);
  });
 };
 getData = function(options, flAutorefresh, url, callback)
 {
  options._stats.dataRequestCount++;
  if (!options.onDataRequestHandler(options._stats, options))
  {
   hideLoadingIndicator(options, null);
   return;
  }
  if (!flAutorefresh)
  {
   showLoadingIndicator(options);
  }
  $.getJSON(url, function(data)
  {
   if (data.error)
   {
    // in case of an error, display the error message
    showError(options, data.error);
   }
   else
   {
    callback(data, options);
   }
  });
 };
 getRateLimit = function(options, callback)
 {
  $.getJSON("https://api.twitter.com/1/account/rate_limit_status.json?callback=?", function(rateLimit)
  {
   options._stats.rateLimit = rateLimit;
   options.onRateLimitDataHandler(options._stats, options);
   callback(rateLimit);
  });
 };
 //]init[ added oncomplete default function
 defaultOnComplete = function(options){
    var tweets = $("div.js-tweet-box")
    if( !tweets || tweets.length < 1 )return;
    tweets.removeClass('tweet-highlighted');
    tweets.first().addClass('tweet-highlighted');
 }
})(jQuery);
/* Ende twitter-jquery.js */
/* Start BasePageNavigation */
var debug = window.location.href.indexOf("rmacnell") > -1;
var pagebreaker = {
  nav:false,
  container:false,
  inited:false,
  pages:[],
  current:0,
  init:function()
  {
    var basepage = jQuery("div.basepage_pages");
    if( basepage.length > 0 )
    {
      this.container = basepage;
      var pagebreak = jQuery(".pagebreak", this.container);
      if( pagebreak.length > 0 )
      {
        var index = 0;
        var instance = this;
        basepage.children().each(function()
                                 {
                                   if( jQuery(this).hasClass("pagebreak") )
                                   {
                                     index++;
                                   }
                                   else
                                   {
                                     if( !instance.pages[index] )
                                     {instance.pages[index] = [];}
                                     instance.pages[index].push(jQuery(this));
                                   }
                                 });
        if( this.pages.length > 1 )
        {
          this.changePage(0);
          this.inited = true;
        }
      }
    }
  },
  initPageNavigation:function()
  {
    if( !this.nav )
    {
      this.nav = jQuery("<ul class=\"basePageNavigation\"/>");
      var prevLi = jQuery("<li style=\"display:none\" class=\"prevPage\"/>");
      var infoLi = jQuery('<li class="pageInfo">Seite <span class="currentPage">0</span> von <span class="pageCount">0</span></li>');
      jQuery(".pageCount", infoLi).html(this.pages.length);
      var nextLi = jQuery("<li style=\"display:none\" class=\"nextPage\"/>");
      var prevA = jQuery("<a href=\"javascript:void(0);\">Vorherige Seite</a>");
      var nextA = jQuery("<a href=\"javascript:void(0);\">Nächste Seite</a>");
      prevLi.append(prevA);
      nextLi.append(nextA);
      this.nav.append(prevLi).append(infoLi).append(nextLi);
      var instance = this;
      prevA.bind("click", function()
      {
        instance.changePage(instance.current-1);
        return false;
      });
      nextA.bind("click", function()
      {
        instance.changePage(instance.current+1);
        return false;
      });
      this.container.after(this.nav);
      this.nav.after("<div style=\"clear:both\"><!-- --></div>");
    }
    jQuery(".currentPage", this.navContainer).html(this.current+1);
    if( this.current != 0 )
    {
      jQuery(".prevPage", this.nav).show();
    }
    else
    {
      jQuery(".prevPage", this.nav).hide();
    }
    if( this.current < this.pages.length-1 )
    {
      jQuery(".nextPage", this.nav).show();
    }
    else
    {
      jQuery(".nextPage", this.nav).hide();
    }
  },
  changePage:function(index)
  {
    if( index >= 0 && index < this.pages.length )
    {
      this.current = index;
      this.initPageNavigation();
      for( var i = 0; i < this.pages.length; i++ )
      {
        if( i != index )
        {
          for( var j = 0; j < this.pages[i].length; j++ )
          {
            this.pages[i][j].hide();
          }
        }
        else
        {
          for( var j = 0; j < this.pages[i].length; j++ )
          {
            this.pages[i][j].show();
          }
        }
      }
      // Textanfang fokussieren(nicht beim initialen Laden der Seite)
      if( this.inited )
      {
        $('html, body').animate({
                                scrollTop: $(this.container)
                                        .parent()
                                        .offset()
                                        .top
                              }, 0);
      }
    }
  }
};
/* Ende BasePageNavigation */
/* Start Addon_GlossarPopup */
(function($) {

function popupParams (w,h,switches,xpos,ypos) {
   var width = "width=" + w;
   var height = ",height=" + h;
   var parent = ",dependent=no";
   var dirbar = ",directories=no";
   var fullscreen = ",fullscreen=0";
   var hotkeys = ",hotkeys=yes";
   var locbar = ",location=no";
   var menubar = ",menubar=no";
   var resizable = ",resizable=no";
   var scrollbars = ",scrollbars=no";
   var statusbar = ",status=no";
   var toolbar = ",toolbar=no";

   if (switches) {
      if (switches.indexOf("p") > -1 ) { parent = ",dependent=yes"}
      if (switches.indexOf("d") > -1 ) { dirbar = ",directories=yes"}
      if (switches.indexOf("h") > -1 ) { hotkeys = ",hotkeys=no"}
      if (switches.indexOf("l") > -1 ) { locbar = ",location=yes"}
      if (switches.indexOf("m") > -1 ) { menubar = ",menubar=yes"}
      if (switches.indexOf("r") > -1 ) { resizable = ",resizable=yes"}
      if (switches.indexOf("s") > -1 ) { scrollbars = ",scrollbars=yes" }
      if (switches.indexOf("u") > -1 ) { statusbar = ",status=yes"}
      if (switches.indexOf("t") > -1 ) { toolbar = ",toolbar=yes"}
      if (switches.indexOf("k") > -1 || switches.indexOf("b") > -1 ) { fullscreen = ",fullscreen=1" }
   }
   var pos = "";
   return width + height + parent + dirbar + hotkeys + locbar + menubar + resizable + scrollbars + statusbar + toolbar + pos + fullscreen;
}

var newwin; var w = 400; var h = 700; var switches;
var params = popupParams(w,h,switches);
jQuery.init_glossarylink = function() {
    baseurl = $('base').attr('href');
    $('.RichTextGlossarLink').removeAttr('onclick').click(function(){
        url = baseurl+$(this).attr('href');
        newwin = window.open(url,"popup", params);   
        return false;
    });
};

jQuery.setGlossaryNav = function(){   
     $('#popup a').click(function(){
       opener.location.href = $(this).attr('href');
       window.close();
       return false;
     });
    $('#navFunctionsClose a').unbind('click').click(function(){
       window.close();
       return false;
     });
  };

jQuery('document').ready(function(){
    $.setGlossaryNav();
});
})(jQuery);
/* Ende Addon_GlossarPopup */
/* Start Addon_Clearfields */
(function($){

jQuery.fn.attachToField = function (id, defaultValue){
    var field = $('#'+id);
    var input_text = field.attr('value');
    return jQuery(field).bind('focus',function(){
       if( input_text == defaultValue ) {
          field.attr('value','');
        }
      }).bind('blur',function(){
        if(field.attr('value')==''){  
          field.attr('value',input_text);
        }
        input_text = field.attr('value');
      });
};
jQuery.init_clearfields = function(){

// attach events to search form input
    jQuery('#f428880d2194').attachToField('f428880d2194','TT.MM.JJJJ');
    jQuery('#f444d2194').attachToField('f444d2194','TT.MM.JJJJ');
    jQuery('#f429702d2194').attachToField('f429702d2194','TT.MM.JJJJ');
    jQuery('#f454720d2194').attachToField('f454720d2194','TT.MM.JJJJ');
    jQuery('#f444674d2194').attachToField('f444674d2194','TT.MM.JJJJ');
    jQuery('#f444660d2194').attachToField('f444660d2194','TT.MM.JJJJ');
    jQuery('#f444336d2194').attachToField('f444336d2194','TT.MM.JJJJ');
    jQuery('#f444618d2194').attachToField('f444618d2194','TT.MM.JJJJ');
    jQuery('#f444602d2194').attachToField('f444602d2194','TT.MM.JJJJ');
    jQuery('#f444580d2194').attachToField('f444580d2194','TT.MM.JJJJ');
    jQuery('#f439588d2194').attachToField('f439588d2194','TT.MM.JJJJ');
    jQuery('#f488468d2194').attachToField('f488468d2194','TT.MM.JJJJ');
    jQuery('#f488482d2194').attachToField('f488482d2194','TT.MM.JJJJ');
    jQuery('#f488508d2194').attachToField('f488508d2194','TT.MM.JJJJ');
    jQuery('#f439626d2194').attachToField('f439626d2194','TT.MM.JJJJ');
    jQuery('#f588142d2194').attachToField('f588142d2194','TT.MM.JJJJ');
    jQuery('#f455098d2194').attachToField('f455098d2194','TT.MM.JJJJ');
    jQuery('#f454958d2194').attachToField('f454958d2194','TT.MM.JJJJ');
    jQuery('#f455016d2194').attachToField('f455016d2194','TT.MM.JJJJ');
    jQuery('#f454976d2194').attachToField('f454976d2194','TT.MM.JJJJ');
    jQuery('#f448504d2194').attachToField('f448504d2194','TT.MM.JJJJ');
    jQuery('#f429722d2194').attachToField('f429722d2194','TT.MM.JJJJ');
    jQuery('#f429808d2194').attachToField('f429808d2194','TT.MM.JJJJ');
    jQuery('#f429974d2194').attachToField('f429974d2194','TT.MM.JJJJ');
    jQuery('#f434528d2194').attachToField('f434528d2194','TT.MM.JJJJ');
    jQuery('#f429718d2194').attachToField('f429718d2194','TT.MM.JJJJ');
    jQuery('#f429990d2194').attachToField('f429990d2194','TT.MM.JJJJ');
    jQuery('#f430004d2194').attachToField('f430004d2194','TT.MM.JJJJ');
    jQuery('#f430042d2194').attachToField('f430042d2194','TT.MM.JJJJ');
    jQuery('#f430062d2194').attachToField('f430062d2194','TT.MM.JJJJ');
    jQuery('#f430088d2194').attachToField('f430088d2194','TT.MM.JJJJ');
    jQuery('#f455572d2194').attachToField('f455572d2194','TT.MM.JJJJ');
    jQuery('#f454802d2194').attachToField('f454802d2194','TT.MM.JJJJ');
    jQuery('#f454820d2194').attachToField('f454820d2194','TT.MM.JJJJ');
    jQuery('#f454808d2194').attachToField('f454808d2194','TT.MM.JJJJ');
    jQuery('#f454814d2194').attachToField('f454814d2194','TT.MM.JJJJ');
    jQuery('#f461970d2194').attachToField('f461970d2194','TT.MM.JJJJ');
    jQuery('#f623626d2194').attachToField('f623626d2194','TT.MM.JJJJ');
    jQuery('#f428880d2196').attachToField('f428880d2196','TT.MM.JJJJ');
    jQuery('#f444d2196').attachToField('f444d2196','TT.MM.JJJJ');
    jQuery('#f429702d2196').attachToField('f429702d2196','TT.MM.JJJJ');
    jQuery('#f454720d2196').attachToField('f454720d2196','TT.MM.JJJJ');
    jQuery('#f444674d2196').attachToField('f444674d2196','TT.MM.JJJJ');
    jQuery('#f444660d2196').attachToField('f444660d2196','TT.MM.JJJJ');
    jQuery('#f444336d2196').attachToField('f444336d2196','TT.MM.JJJJ');
    jQuery('#f444618d2196').attachToField('f444618d2196','TT.MM.JJJJ');
    jQuery('#f444602d2196').attachToField('f444602d2196','TT.MM.JJJJ');
    jQuery('#f444580d2196').attachToField('f444580d2196','TT.MM.JJJJ');
    jQuery('#f439588d2196').attachToField('f439588d2196','TT.MM.JJJJ');
    jQuery('#f488468d2196').attachToField('f488468d2196','TT.MM.JJJJ');
    jQuery('#f488482d2196').attachToField('f488482d2196','TT.MM.JJJJ');
    jQuery('#f488508d2196').attachToField('f488508d2196','TT.MM.JJJJ');
    jQuery('#f439626d2196').attachToField('f439626d2196','TT.MM.JJJJ');
    jQuery('#f588142d2196').attachToField('f588142d2196','TT.MM.JJJJ');
    jQuery('#f455098d2196').attachToField('f455098d2196','TT.MM.JJJJ');
    jQuery('#f454958d2196').attachToField('f454958d2196','TT.MM.JJJJ');
    jQuery('#f455016d2196').attachToField('f455016d2196','TT.MM.JJJJ');
    jQuery('#f454976d2196').attachToField('f454976d2196','TT.MM.JJJJ');
    jQuery('#f448504d2196').attachToField('f448504d2196','TT.MM.JJJJ');
    jQuery('#f429722d2196').attachToField('f429722d2196','TT.MM.JJJJ');
    jQuery('#f429808d2196').attachToField('f429808d2196','TT.MM.JJJJ');
    jQuery('#f429974d2196').attachToField('f429974d2196','TT.MM.JJJJ');
    jQuery('#f434528d2196').attachToField('f434528d2196','TT.MM.JJJJ');
    jQuery('#f429718d2196').attachToField('f429718d2196','TT.MM.JJJJ');
    jQuery('#f429990d2196').attachToField('f429990d2196','TT.MM.JJJJ');
    jQuery('#f430004d2196').attachToField('f430004d2196','TT.MM.JJJJ');
    jQuery('#f430042d2196').attachToField('f430042d2196','TT.MM.JJJJ');
    jQuery('#f430062d2196').attachToField('f430062d2196','TT.MM.JJJJ');
    jQuery('#f430088d2196').attachToField('f430088d2196','TT.MM.JJJJ');
    jQuery('#f455572d2196').attachToField('f455572d2196','TT.MM.JJJJ');
    jQuery('#f454802d2196').attachToField('f454802d2196','TT.MM.JJJJ');
    jQuery('#f454820d2196').attachToField('f454820d2196','TT.MM.JJJJ');
    jQuery('#f454808d2196').attachToField('f454808d2196','TT.MM.JJJJ');
    jQuery('#f454814d2196').attachToField('f454814d2196','TT.MM.JJJJ');
    jQuery('#f461970d2196').attachToField('f461970d2196','TT.MM.JJJJ');
    jQuery('#f623626d2196').attachToField('f623626d2196','TT.MM.JJJJ');
    jQuery('#f454784d448522').attachToField('f454784d448522','mm.dd.yyyy');
    jQuery('#f6226d448522').attachToField('f6226d448522','mm.dd.yyyy');
    jQuery('#f448480d448522').attachToField('f448480d448522','mm.dd.yyyy');
    jQuery('#f454790d448522').attachToField('f454790d448522','mm.dd.yyyy');
    jQuery('#f454796d448522').attachToField('f454796d448522','mm.dd.yyyy');
    jQuery('#f455188d448522').attachToField('f455188d448522','mm.dd.yyyy');
    jQuery('#f455518d448522').attachToField('f455518d448522','mm.dd.yyyy');
    jQuery('#f454784d448524').attachToField('f454784d448524','mm.dd.yyyy');
    jQuery('#f6226d448524').attachToField('f6226d448524','mm.dd.yyyy');
    jQuery('#f448480d448524').attachToField('f448480d448524','mm.dd.yyyy');
    jQuery('#f454790d448524').attachToField('f454790d448524','mm.dd.yyyy');
    jQuery('#f454796d448524').attachToField('f454796d448524','mm.dd.yyyy');
    jQuery('#f455188d448524').attachToField('f455188d448524','mm.dd.yyyy');
    jQuery('#f455518d448524').attachToField('f455518d448524','mm.dd.yyyy');
    jQuery('#f429700d592122').attachToField('f429700d592122','Suchbegriff');
    jQuery('#f621246d592122').attachToField('f621246d592122','Suchbegriff');
    jQuery('#f454676d568974').attachToField('f454676d568974','jj/mm/aaaa');
    jQuery('#f461970d568974').attachToField('f461970d568974','jj/mm/aaaa');
    jQuery('#f454676d569046').attachToField('f454676d569046','jj/mm/aaaa');
    jQuery('#f461970d569046').attachToField('f461970d569046','jj/mm/aaaa');
return;
};

})(jQuery);
/* Ende Addon_Clearfields */
/* Start Addon_Accordion */
/*!
 * Accordion Plugin
 * Author: @jkuschel
 * Further changes:
 * Licensed under the MIT license
 */
;
(function ($){
  if( !$.materna ) {
    $.materna = {};
  };
  $.materna.Accordion = function (el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    // Add a reverse reference to the DOM object
    base.$el.data("materna.Accordion", base);
  
    var saveSelectedTab = function(tabControlId,tabId){
      jQuery.cookie("sel_tab_"+tabControlId,tabId,{path:"/"});
    };
  
    var restoreSelectedTab =  function(tabControlId){
      var selected = jQuery.cookie("sel_tab_"+tabControlId);
      if(selected){
        $("ol li a",$("#"+tabControlId)).each(function(){
            if(selected==$(this).attr("rel"))
                $(this).click();
        });     
      }
    };
  
    function accordionClick (that,secondLevel){
        if (base.options.multiple == false && base.options.globalClose == false){
          // Close all open panels of this accordion
          $(that).toggleClass('open').toggleClass('close').next().toggleClass('open').toggleClass('close');
          base.controls.not(that).not('.close').toggleClass('open').toggleClass('close').next().toggleClass('open').toggleClass('close').hide();
        }
        else {
          // Just open this panel
          if (base.options.panelBefore === true){
            var index = $.inArray(that, base.controls);   
            $(that).toggleClass('open').toggleClass('close')
            base.panels.eq(index).toggleClass('open').toggleClass('close');
          
          } else{
            $(that).toggleClass('open').toggleClass('close').next().toggleClass('open').toggleClass('close');
          }
        }     
       return;
    };
  
    function buildElements(){
      base.controls = base.$el.find(base.options.controls);
      base.panels = base.$el.find(base.options.panels);
      if(base.options.openAll){
         base.panels.addClass('open');
         base.controls.addClass('open');
      } else if(base.options.openFirst == true){
       base.panels.first().addClass('open').end().not('.open').addClass('close');
       base.controls.first().addClass('open').end().not('.open').addClass('close');
      } else {
       base.panels.addClass('close');
       base.controls.addClass('close');
      }
      return base.controls.attr('tabindex','0').click(function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        accordionClick(this);
      }).keydown(function(event) {
          if (event.which == 13) {
            event.preventDefault();
            $(this).triggerHandler('click');
        };
      });
    };
  
    function buildSecondLevel(){
      base.secondControls = base.$el.find('.section h2');
      base.secondControls.wrapInner('<span/>').addClass('close').click(function(e){
        e.stopImmediatePropagation();
        accordionClick(this,true);
      });    
    };
    base.init = function ()  {
    
      base.options = $.extend({}, $.materna.Accordion.defaultOptions, options);
      buildElements();
    
      if( base.options.size != '' ){;
        base.controls.addClass(base.options.size);
      }
    
      if( base.options.has2ndLevel == true ) {
        buildSecondLevel();     
      }
    };
    base.init();
  };
  $.materna.Accordion.defaultOptions = {
    dynLoad: true,
    controls:'h2',
    panels:'.section',
    globalControls:'',
    globalPanels:'',
    size:'',
    multiple:true,
    has2ndLevel:false,
    globalClose:false,
    openFirst:true,
    openAll:false,
    panelBefore: true
  };
  $.fn.materna_Accordion = function(options){
    return this.each(function (){(new $.materna.Accordion(this, options));});
  };
})(jQuery);
/* Ende Addon_Accordion */
jQuery(document).ready(function (){
    // Glossar-Popup
    $ .init_glossarylink();
    // Clearfields
    $ .init_clearfields();
    // Twitter
    var twitterContainer = $('#social-network div.twitter-box');
    if (twitterContainer && twitterContainer.length > 0) {
      try {
        twitterContainer.jTweetsAnywhere({
          // DIESE ZEILE BEI BEDARF AENDERN: Kann zwei Formen annehmen, die sich in der Quelle der angezeigten Tweets unterscheiden:
          // 1. Account: username: '$ACCOUNT_NAME', (Beispiel "RegSprecher")
          // 2. Suche: searchParams: ['q=$SUCHBEGRIFF'],
          username: 'RegSprecher',
          count: 3,
          tweetVisualizer: function(tweetFeedElement, tweetElement, inserter, options) {                    
            // test if there is an element, to be removed, then remove it ...
            if (tweetFeedElement.children().length >= 3) {
              tweetFeedElement.children(':last-child').remove();
            }
            // insert (append/prepend) the tweetElement to the tweetFeedElement
            tweetFeedElement[inserter](tweetElement);
          },
          showTweetFeed: {
            showTimestamp: { refreshInterval: 15 },
            showProfileImages: false,
            showInReplyTo: false,
            includeRetweets: true,
            autorefresh: {
              mode: "auto-insert",
              // in welchem Sekunden-Intervall sollen die Tweets neu geholt werden(Achtung: 150 Aufrufe der Twitter API pro Client(Client := ein Nutzer, der die Seite aufruft)
              interval: 60
            }
          }
        });
      } catch( e ) {}
    }
    //basepage navigation
    pagebreaker.init();
    // prevent GSB-page-reloads in IE triggered by a[href="#"] in datepicker generated content
    $("body").delegate(".ui-state-default", "click", function(e){
      e.preventDefault();
    });
    // Bühne hide-Klassen entfernen
    $("#stage .teaser.hide").removeClass("hide");
    //Bildergalerie Stage einblenden
   $('.gallery .gallery-stage').addClass("showGalleryContent");
    // Datepicker Locale setzen
    $ .datepicker.setDefaults($ .datepicker.regional['de']);

   //Glossar-Accordion
   if(jQuery('#glossaryAccordion').length > 0){
       jQuery('#glossaryAccordion').materna_Accordion({controls : '.accordion-heading', panels : '.accordion-body', multiple : false, openFirst : false}).find('.accordion-group.active .accordion-heading').trigger('click').focus();
   }
});