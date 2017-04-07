---
layout: post
title: "从零搭建一个良好的Spring Web后端框架"
date: 2017-04-07 12:13:13
tags:
    - framework
---

**我们使用IDEA和Maven**

# 1 模块

## 1.1 新建模块

将父模块的module命名为`x-parent`,新建两个子module，分别为`x-web`和`x-biz`。

**注意**:添加module我们直接用鼠标操作IDEA，以下XML是自动生成的。
```xml
<!-- 父module要指明子module: -->
<modules>
    <module>x-web</module>
    <module>x-biz</module>
</modules>
```
```xml
<!-- 子module要指定parent: -->
<parent>
    <artifactId>x-parent</artifactId>
    <groupId>me.ysmull</groupId>
    <version>1.0</version>
</parent>
<modelVersion>4.0.0</modelVersion>
<artifactId>x-biz</artifactId>
```
```xml
<!-- 子module要指定parent: -->
<parent>
    <artifactId>x-parent</artifactId>
    <groupId>me.ysmull</groupId>
    <version>1.0</version>
</parent>
<modelVersion>4.0.0</modelVersion>
<artifactId>x-web</artifactId>
```

## 1.2 在`x-web`模块里面引入`x-biz`依赖
`x-web`模块主要是一些Controller，会引用到`x-biz`模块的类，我们可以直接在`x-web`的pom里加入`x-biz`的dependency
```xml
<dependencies>
    <dependency>
        <groupId>me.ysmull.x</groupId>
        <artifactId>x-biz</artifactId>
        <version>1.0</version>
    </dependency>
</dependencies>
```
但是这样做的缺点是需要制定版本，我们希望版本由父模块指定。所以我们在父模块的pom使用`dependencyManagement`，子模块不用指定版本号，Maven会沿着父子层次向上走，直到找到一个拥有`dependencyManagement`元素的项目，然后使用其指定的版本号。
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>me.ysmull.x</groupId>
            <artifactId>x-biz</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 1.3 设置 webroot

在x-web模块中新建一个叫`webapp`的文件夹，然后在x-web的pom里增加一句
```xml
<packaging>war</packaging>
```
此时IDEA将自动把webapp目录识别为webroot。如果想要自己指定webroot，参考[这里][设置webroot]。

在父模块的pom中增加如下语句来指定jdk版本。


# 2 配置 Spring

## 2.1 引入依赖

在父模块的pom里加入如下语句
```xml
<properties>
    <spring_version>4.3.7.RELEASE</spring_version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>${spring_version}</version>
    </dependency>

    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.8.9</version>
    </dependency>

    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjrt</artifactId>
        <version>1.8.9</version>
    </dependency>

    <!-- data source -->
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>2.6.1</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.39</version>
    </dependency>

    <!-- File Upload -->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.3.2</version>
    </dependency>
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>2.2</version>
    </dependency>

    <!-- 解析对象为json -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.8.1</version>
    </dependency>

</dependencies>
```
## 2.2 配置jdk版本
在父模块的pom里加入如下语句
```xml
<build>
    <plugins>
        <plugin>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <configuration>
                <compilerArgument>-parameters</compilerArgument>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <version>2.7</version>
            <configuration>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```
## 2.3 编写配置文件
`web.xml`
```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <!-- The definition of the Root Spring Container shared by all Servlets and Filters -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/spring/root-context.xml</param-value>
    </context-param>

    <!-- Creates the Spring Container shared by all Servlets and Filters -->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- Processes application requests -->
    <servlet>
        <servlet-name>appServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/spring/appServlet/servlet-context.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
        <async-supported>true</async-supported>
    </servlet>
    <servlet-mapping>
        <servlet-name>appServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```
`root-context.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:beans="http://www.springframework.org/schema/beans"
        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <beans:import resource="classpath:biz-context.xml"/>
    <beans:import resource="classpath:data-source.xml"/>

</beans:beans>
```
`servlet-context.xml`
```xml
<annotation-driven/>
<context:component-scan base-package="me.ysmull.x.web"/>

<aop:aspectj-autoproxy/>

<!-- Handles HTTP GET requests for /resources/** by efficiently serving
    up static resources in the ${webappRoot}/resources/ directory -->

<resources mapping="/resources/**" location="/resources/"/>
<resources mapping="/view/**" location="/view/"/>
<resources mapping="/asset/**" location="/asset/"/>
<resources mapping="/dep/**" location="/dep/"/>

<!-- Resolves views selected for rendering by @Controllers to .jsp resources
    in the /WEB-INF/views directory -->
<beans: class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <beans:property name="prefix" value="/WEB-INF/views/"/>
    <beans:property name="suffix" value=".jsp"/>
</beans:bean>

<!-- Only needed because we require fileupload in the
    org.springframework.samples.mvc.fileupload package -->
<beans:bean id="multipartResolver"
            class="org.springframework.web.multipart.commons.CommonsMultipartResolver"/>
```
`biz-context.xml`
```xml
<task:annotation-driven/>
<tx:annotation-driven transaction-manager="txManager"/>
<aop:aspectj-autoproxy/>

<context:annotation-config/>
<context:component-scan base-package="me.ysmull.x.biz"/>
<context:component-scan base-package="me.ysmull.x.dao"/>

<bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>

<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate" autowire="byName">
    <property name="dataSource" ref="dataSource"/>
</bean>

<bean id="namedParameterJdbcTemplate"
      class="org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate"
      autowire="byName">
    <constructor-arg ref="dataSource" index="0"/>
</bean>
```
`x-web`的目录结构：
```
x-web
├── src
│   ├── main
│   │   ├── config
│   │   │   └── local
│   │   │       └── data-source.xml
│   │   ├── filters
│   │   │   └── local
│   │   │       └── env.properties
│   │   ├── java
│   │   │
│   │   ├── resources
│   │   │   └── biz-context.xml
│   │   └── webapp
│   │       └── WEB-INF
│   │           ├── spring
│   │           │   ├── appServlet
│   │           │   │   └── servlet-context.xml
│   │           │   └── root-context.xml
│   │           └── web.xml
│   └── test
│       └── java
└── pom.xml
```
[设置webroot]:http://stackoverflow.com/questions/13390239/how-to-configure-custom-maven-project-structure/13390266
