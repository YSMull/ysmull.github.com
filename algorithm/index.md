---
layout: default
---

<ul>
    {% for post in site.posts %}
        {% if post.tags contains "oj" %}
        <li>
            <span class="date">{{ post.date | date:"%Y/%m/%d" }}</span> - <a href="{{ post.url }}{{ '#back' }}">{{ post.title }}</a>
        </li>
        {% endif %}
    {% endfor %}
</ul>
