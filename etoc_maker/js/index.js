var settings = {};

$(document).ready(function(){
  // TODO: set defaults based on query string
  for (var journal in JOURNALS) {
    $('#journal').append(`<option value="${journal}">${JOURNALS[journal].name}</option>`)
  }
  settings.journal = $('#journal').val();
  settings.dateRange = $('#date-range').val();
  updateEmail();
})

$('#copy-template').on('click', function(){
  // copied from stack overflow
  var copyTextarea = $('#textarea')
  copyTextarea.focus();
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
})

$('#journal').on('change', function() {
  settings.journal = this.value;
  updateEmail();
});

$('#date-range').on('change', function() {
  settings.dateRange = this.value;
  updateEmail();
});

function endDate(){
  var days = settings.dateRange == 'weekly' ? 7 : 365;
  return new Date(Date.now() - 24 * 60 * 60 * 1000 * days);
}

var search = "https://api.plos.org/search?callback=?"

function queryStringData(startDate, endDate, callback) {
  return {
    fl: `id,title,article_type,author_display`,
    wt: 'json',
    'json.wrf': callback,
    q: `publication_date:[${startDate.toISOString()} TO ${endDate.toISOString()}] AND -id:(*/*/*) AND journal:"${JOURNALS[settings.journal].name}"`
  }
}

function solrCallback(data){
  $('#articles').html(''); // reset html
  var docs = data.response.docs;
  ARTICLE_TYPE_ORDER.forEach(function(articleType) {
    var articleDocs = docs.filter(function(doc) { return doc.article_type == articleType; })
    if (articleDocs.length > 0) {
      var articleHeader = $('#articles').append(`<h3 class="h3 article-topic" style="text-transform:uppercase;">${articleType}</h3>`);
      articleDocs.forEach(function(articleDoc) {
        $('#articles').append(buildArticleHTML(articleDoc))
      })
    }
  })
  $('#textarea').val($('#template').html())
}

function buildArticleHTML(doc){
  return `<div class="article-item" style="margin-bottom: 25px; padding-left:15px; border-left:1px solid #cdcdcd;">
    <h4 class="h4 article-title" style="margin-top:0; margin-bottom: 5px;">
    <a href="https://dx.plos.org/${doc.id}" style="color:${JOURNALS[settings.journal]['color']}; font-size:24px; text-decoration:none;" target="_blank">
      ${doc.title}
    </a>
    </h4>
    <p class="byline" style="font-weight:bold; color: #808080; margin-top: 0 !important;">
      ${doc.author_display.join(', ')}
    </p>
  </div>`
}

function setLiveintentAds() {
  $("#ad-top").html(LIVEINTENT[settings.journal].top);
  $("#ad-bottom").html(LIVEINTENT[settings.journal].bottom);
  $("#ad-rtb").html(LIVEINTENT[settings.journal].rtb);
}

function updateEmail (){
  $('#header-image').attr('src', JOURNALS[settings.journal]['header_image']);
  $('#header-row').attr('style', `background:${JOURNALS[settings.journal]['color']}`);
  $('#header-text').html(`New Articles in <em>${JOURNALS[settings.journal]['name']}</em>`)
  $('#register').css('background', JOURNALS[settings.journal]['color']);
  var dateOptions = {year: 'numeric', month: 'long', day: 'numeric'}
  $('#publish-date-range').text(`PUBLISHED: ${endDate().toLocaleDateString('en-US', dateOptions)} to ${new Date().toLocaleDateString('en-US', dateOptions)}`)
  setLiveintentAds()
  $.getJSON(search, queryStringData(endDate(), new Date(), 'solrCallback'))
}

var PLACEMENT_ID = new Date().getTime();

var LIVEINTENT = {
  'pbio' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216855&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216855&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216856&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216857&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216858&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216858&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216859&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216859&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216860&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216860&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216861&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216862&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216863&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216863&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216864&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216864&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124682200&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682201&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682202&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682203&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682204&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682205&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682206&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682207&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682208&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682209&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682210&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682211&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682212&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682213&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682214&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682215&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682216&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682217&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682218&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682219&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'pcbi' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216845&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216845&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216846&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216847&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216848&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216848&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216849&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216849&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216850&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216850&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216851&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216852&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216853&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216853&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216854&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216854&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124682100&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682101&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682102&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682103&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682104&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682105&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682106&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682107&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682108&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682109&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682110&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682111&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682112&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682113&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682114&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682115&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682116&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682117&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682118&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682119&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'pgen' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216825&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216825&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216826&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216827&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216828&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216828&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216829&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216829&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216830&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216830&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216831&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216832&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216833&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216833&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216834&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216834&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124681900&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681901&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681902&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681903&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681904&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681905&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681906&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681907&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681908&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681909&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681910&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681911&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681912&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681913&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681914&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681915&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681916&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681917&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681918&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681919&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'pmed' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216865&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216865&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216866&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216867&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216868&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216868&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216869&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216869&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216870&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216870&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216871&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216872&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216873&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216873&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216874&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216874&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124682300&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682301&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682302&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682303&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682304&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682305&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682306&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682307&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682308&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682309&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682310&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682311&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682312&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682313&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682314&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682315&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682316&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682317&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682318&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682319&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'pntd' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216835&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216835&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216836&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216837&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216838&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216838&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216839&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216839&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216840&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216840&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216841&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216842&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216843&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216843&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216844&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216844&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124682000&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682001&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682002&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682003&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682004&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682005&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682006&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682007&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682008&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682009&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682010&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682011&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682012&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682013&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682014&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682015&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682016&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682017&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682018&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124682019&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'pone' : {
    'top' : '<table cellspacing="0" cellpadding="0" border="0" width="728" style="height:90px; display:block; font-family: Arial,Helvetica,sans-serif;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=210886&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210886&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=210887&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=210888&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=210889&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210889&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=210890&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210890&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=210891&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210891&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=210892&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=210893&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=210894&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210894&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=210895&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=210895&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124614000&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614001&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614002&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614003&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614004&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614005&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614006&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614007&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614008&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614009&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614010&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614011&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614012&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614013&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614014&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614015&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614016&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614017&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614018&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124614019&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  },
  'ppat' : {
    'top' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216815&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216815&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216816&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216817&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216818&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216818&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216819&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216819&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'bottom' : '<table border="0" cellpadding="0" cellspacing="0"  align="center" style="height:90px; display:block; margin-left:auto; margin-right:auto;"><tr><td colspan="2"><a href="http://li.e.plos.org/click?s=216820&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216820&layout=marquee&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0" style="display: block; width:100%; height:auto;" width="728px;" /></a></td></tr><tr style="display:block; height:1px; line-height:1px;"><td><img src="http://li.e.plos.org/imp?s=216821&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td><td><img src="http://li.e.plos.org/imp?s=216822&sz=1x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" height="1" width="10" /></td></tr><tr><td align="left"><a href="http://li.e.plos.org/click?s=216823&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216823&sz=116x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td><td align="right"><a href="http://li.e.plos.org/click?s=216824&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" rel="nofollow"><img src="http://li.e.plos.org/imp?s=216824&sz=69x15&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" border="0"/></a></td></tr></table>',
    'rtb' : '<table cellpadding="0" cellspacing="0" border="0" width="40" height="6"><tbody><tr><td><img src="http://li.e.plos.org/imp?s=124681800&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681801&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681802&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681803&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681804&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681805&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681806&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681807&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681808&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681809&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681810&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681811&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681812&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681813&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681814&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681815&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681816&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681817&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681818&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td><td><img src="http://li.e.plos.org/imp?s=124681819&sz=2x1&li=%%listid%%&e=%%emailaddr%%&p=' + PLACEMENT_ID + '" width="2" height="6" border="0" /></td></tr></tbody></table>'
  }
}


var JOURNALS = {
  'pbio': {
    'new_hostname': 'http://journals.plos.org/plosbiology',
    'old_hostname': 'http://www.plosbiology.org',
    'shortcode': 'bio',
    'journalKey': 'PLoSBiology',
    'name': 'PLOS Biology',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_bio_h.png',
    'liveintent_ad_top': LIVEINTENT['pbio']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pbio']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pbio']['rtb']
  },
  'pcbi': {
    'new_hostname': 'http://journals.plos.org/ploscompbiol',
    'old_hostname': 'http://www.ploscompbiol.org',
    'shortcode': 'cbi',
    'journalKey': 'PLoSCompBiol',
    'name': 'PLOS Computational Biology',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_cb_h.png',
    'liveintent_ad_top': LIVEINTENT['pcbi']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pcbi']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pcbi']['rtb']
  },
  'pgen': {
    'new_hostname' : 'http://journals.plos.org/plosgenetics',
    'old_hostname': 'http://www.plosgenetics.org',
    'shortcode': 'gen',
    'journalKey': 'PLoSGenetics',
    'name': 'PLOS Genetics',
    'color': '#16A127',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_gen_h.png',
    'liveintent_ad_top': LIVEINTENT['pgen']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pgen']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pgen']['rtb']
  },
  'pmed': {
    'new_hostname': 'http://journals.plos.org/plosmedicine',
    'old_hostname': 'http://www.plosmedicine.org',
    'shortcode': 'med',
    'journalKey': 'PLoSMedicine',
    'name': 'PLOS Medicine',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_med_h.png',
    'liveintent_ad_top': LIVEINTENT['pmed']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pmed']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pmed']['rtb']
  },
  'pntd': {
    'new_hostname': 'http://journals.plos.org/plosntds',
    'old_hostname': 'http://www.plosntds.org',
    'shortcode': 'ntd',
    'journalKey': 'PLoSNTD',
    'name': 'PLOS Neglected Tropical Diseases',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/2/PLOS_ntd_h_tenth.png',
    'liveintent_ad_top': LIVEINTENT['pntd']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pntd']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pntd']['rtb']
  },
  'pone': {
    'new_hostname': 'http://journals.plos.org/plosone',
    'old_hostname': 'http://plosone.org',
    'shortcode': 'one',
    'journalKey': 'PLoSONE',
    'name': 'PLOS ONE',
    'color': '#F8AF2D',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_one_h_tenth.png',
    'liveintent_ad_top': LIVEINTENT['pone']['top'],
    'liveintent_ad_bottom': LIVEINTENT['pone']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['pone']['rtb']
  },
  'ppat': {
    'new_hostname': 'http://journals.plos.org/plospathogens',
    'old_hostname': 'http://www.plospathogens.org',
    'shortcode': 'pat',
    'journalKey': 'PLoSPathogens',
    'name': 'PLOS Pathogens',
    'color': '#891FB1',
    'header_image': 'http://image.e.plos.org/lib/fe8c137275630c7873/m/1/PLOS_path_h.png',
    'liveintent_ad_top': LIVEINTENT['ppat']['top'],
    'liveintent_ad_bottom': LIVEINTENT['ppat']['bottom'],
    'liveintent_ad_rtb': LIVEINTENT['ppat']['rtb']
  }
}

var ARTICLE_TYPE_PLURAL = {
  'Message from PLoS': 'Messages from PLoS',
  'Topic Page': 'Topic Pages',
  'Editorial': 'Editorials',
  'Formal Comment': 'Formal Comments',
  'Overview': 'Overviews',
  'Message from ISCB': 'Messages from ISCB',
  'Synopsis': 'Synopses',
  'Education': 'Education',
  'Interview': 'Interviews',
  'Debate': 'Debates',
  'The <em>PLoS Medicine</em> Debate': 'The <em>PLoS Medicine</em> Debates',
  'Viewpoints': 'Viewpoints',
  'Expert Commentary': 'Expert Commentaries',
  'Essay': 'Essays',
  'Research Matters': 'Research Matters',
  'Feature': 'Features',
  'Unsolved Mystery': 'Unsolved Mysteries',
  'Neglected Diseases': 'Neglected Diseases',
  'Special Report': 'Special Reports',
  'Opinion': 'Opinions',
  'Perspective': 'Perspectives',
  'Historical and Philosophical Perspectives': 'Historical and Philosophical Perspectives',
  'Book Review': 'Book Reviews',
  'Book Review/Science in the Media': 'Book Reviews/Science in the Media',
  'Obituary': 'Obituaries',
  'Journal Club': 'Journal Clubs',
  'Primer': 'Primers',
  'Community Page': 'Community Pages',
  'Health in Action': 'Health in Action',
  'Policy Platform': 'Policy Platform',
  'Policy Forum': 'Policy Forums',
  'Guidelines and Guidance': 'Guidelines and Guidance',
  'Historical Profiles and Perspectives': 'Historical Profiles and Perspectives',
  'From Innovation to Application': 'From Innovation to Application',
  'Research in Translation': 'Research in Translation',
  'Student Forum': 'Student Forums',
  'Symposium': 'Symposia',
  'Learning Forum': 'Learning Forums',
  'Case Report': 'Case Reports',
  'Pearls': 'Pearls',
  'Review': 'Reviews',
  'Technical Report': 'Technical Reports',
  'Research Article': 'Research Articles',
  'Short Reports': 'Short Reports',
  'Methods and Resources': 'Methods and Resources',
  'Retraction': 'Retractions',
  'Correction': 'Corrections',
  'Meta-Research Article': 'Meta-Research Articles',
  'Open Highlights': 'Open Highlights',
  'Photo Quiz': 'Photo Quizzes'
}

var ARTICLE_TYPE_ORDER = [
  'Message from PLoS',
  'Overview',
  'Editorial',
  'Topic Page',
  'Message from ISCB',
  'Research Matters',
  'Essay',
  'Feature',
  'Unsolved Mystery',
  'Neglected Diseases',
  'Special Report',
  'Opinion',
  'Health in Action',
  'Policy Platform',
  'Policy Forum',
  'Guidelines and Guidance',
  'Perspective',
  'Historical and Philosophical Perspectives',
  'Book Review',
  'Book Review/Science in the Media',
  'Obituary',
  'Journal Club',
  'Community Page',
  'Open Highlights',
  'Primers',
  'Synopsis',
  'Education',
  'Interview',
  'Debate',
  'The PLoS Medicine Debate',
  'Viewpoints',
  'Expert Commentary',
  'Historical Profiles and Perspectives',
  'From Innovation to Application',
  'Research in Translation',
  'Student Forum',
  'Symposium',
  'Learning Forum',
  'Case Report',
  'Pearls',
  'Review',
  'Technical Report',
  'Meta-Research Article',
  'Research Article',
  'Short Reports',
  'Methods and Resources',
  'Formal Comment',
  'Photo Quiz',
  'Retraction',
  'Correction',
]