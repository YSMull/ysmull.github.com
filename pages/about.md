---
layout: base
title: 关于
---
<!--head><bgsound src="你的音乐连接" loop="-1"></head-->
<strong>Email</strong>: <span class="dynamic-email">znblhfh@bhgybbx.pbz</span> </p>

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