window.addEventListener("load", function(e) {
  var dialog = document.querySelector('#dialog1');
  document.querySelector('#format').addEventListener("click", function(evt) {
    format();
  });
});


window.addEventListener("load", function(e) {
  var dialog = document.querySelector('#dialog1');
  document.querySelector('#format-2-java').addEventListener("click", function(evt) {
    format('java');
  });
});

function format(output_format){
  var input_query = document.querySelector('#input').value;
  //console.log(input_query);
  
  input_query = normalized(input_query);
  //console.log(input_query);

  console.log(`processed input query: ${input_query}`);

  input_query = encodeURIComponent(input_query);
  //console.log(input_query);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://www.gudusoft.com/format.php', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.onload = function(e) {
    //console.log(this.response);
    var obj = JSON.parse(this.response);
    //console.log(obj.rspn_formatted_sql);
    document.querySelector('#output').innerHTML = obj.rspn_formatted_sql;
    copyTextToClipboard(obj.rspn_formatted_sql);
  };

  var params = "rqst_input_sql=" + input_query;

  if(output_format === 'java'){
    params += "&rqst_output_fmt=java";
  }

  xhr.send(params);
}



function normalized(str){
  str = str.replace(/\"|\+|\;/g, '');
  return str;
}



//from http://stackoverflow.com/a/30810322/1216961
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}