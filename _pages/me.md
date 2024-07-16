---
layout: about
---

我是 YSMull，18 年毕业至今，一直在 ~~网易杭州研究院~~ 研发 [**网易有数 BI**](https://youdata.163.com/)

<p><strong>Email</strong>: <span class="dynamic-email">znblhfh@163.pbz</span></p>

<p><strong>WeChat</strong>:
<div style="text-align:left">
    <img src="https://p.ipic.vip/yfckv3.jpg" width="20%" height="auto" alt="">
</div>

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
