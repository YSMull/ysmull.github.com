---
layout: about
---

This is an about page. Tell the people visiting your page a little about yourself.


<p><strong>Email</strong>:<span class="dynamic-email">lfzhyy@nyvlha.pbz</span></p>


<!-- <script src="//onk1k9bha.bkt.clouddn.com/zepto.min.js"></script> -->

<script type="text/javascript">
function rot13(str) {
  return str.replace(/[a-zA-Z]/g, function(c) {
    return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
  });
}

$(document).ready(function () {
    $('.dynamic-email').each(function (idx, obj) {
        var email = rot13($(obj).html());
        $(obj).html("<a href='mailto:" + email + "'>" + email + "</a>");
    });
});
</script>
