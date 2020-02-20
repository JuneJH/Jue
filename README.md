# MVVM原理

1. MVVM框架主要包括三部分组成，其中有model,view,view-model
   - model表示数据，各种数据，后端，缓存
   - view表示用户所看到的页面
   - view-model处理业务和数据




           ——————————————————>  
   view       双向数据绑定           view-model      <——————http请求————————> model
           <——————————————————


           
   view-model 通过双向数据绑定 实时的将view-model中的数据展现在view中。通过http请求将后端数据与view-model中的数据同步

  2. 缺点
     - bug难以定位，当页面展示出现问题时，bug的产生可能是view层自己代码错误，也有可能是view-model处理业务错误，或者是后端数据错误。
     - 构建大型项目，成本较高(不了解)

   **MVVM原理的框架的精髓在于将用户的行为和状态分离出一个抽象**


# MVC

1. mvc框架是前期的产物，主要包括model，view，controller

   - controller层责任大，代码冗余，复用性低，复杂度高
   - 直接操作dom，影响性能，效率
   - model数据变化需要主动通知view
   
