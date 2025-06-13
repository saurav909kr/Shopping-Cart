var shoppingCart = ( function(){

    let cart = [];

    function Item(name, price, count){
        this.name = name;
        this.price = price;
        this.count = count;
      }
    
    //save cart
    function saveCart(){
        localStorage.setItem('shoppingcart', JSON.stringify(cart));
    }

    //local cart
    function loadCart(){
        cart = JSON.parse(localStorage.getItem('shoppingCart'));
    }

    if (localStorage.getItem('shoppingCart') != null) {
        loadCart();
    }

    var obj = {};

    //add to cart
    obj.addItemToCart = function(name, price, count){
        for(var item of cart){
            // if same item is already present in cart 
            if(item.name === name){
                item.count += count;
                saveCart();
                return;
            }
        }
        // if item is not already present in cart 
        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    }

    //set count for item in cart
    obj.setCountForItem = function (name,count){
        for(var i of cart){
            if(i.name === name){
                i.count = count;
                break;
            }
        }
    };

    //decrese the number of item from cart
    obj.removeItemFromCart = function(name){
        for(let i = 0; i < cart.length; i++){
            if(cart[i].name === name){
                cart[i].count -= 1;

                if(cart[i].count <= 0){
                    cart.splice(i,1); // remove item completely
                }
                
                break;
            }
        }
        saveCart();
    }

    //completely  remove the item from cart
    obj.removeItemFromCartAll = function(name){
        for(var item of cart){
            if(item.name === name){
                cart.splice(item,1);// remove the item from the cart
            break;
            }
        }
        saveCart();
    }
    
    //clear cart
    obj.clearCart = function(){
        cart = [];
        saveCart();
    }

    //count cart
    obj.totalCount = function(){
        var totalCount = 0;
        // for(var item of cart){
        //     totalCount += cart[item].count;
        // }
        for (var i in cart){
            var item = cart[i];
            if(item && item.count !== undefined){
                totalCount += item.count;
            }
        }
        return totalCount;
    }

    //total cart price
    obj.totalCart = function(){
         var totalCart = 0;
         for(var item in cart){
          totalCart += cart[item].price*cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    // list  cart 
    obj.listCart = function(){
        var cartCopy = [];
        for(var i in cart){
          var  item = cart[i];
            itemcopy = {};
            for(var p in item){
                itemcopy[p] =  item[p];
            }
            itemcopy.total = Number(item.price * item.count).toFixed(2)
            cartCopy.push(itemcopy);
        }
        return cartCopy;
    }
 return obj;
})()

//add to cart
 $('.default-btn').click(function (event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
});

//clear item 
$('.clear-cart').click(()=>{
shoppingCart.clearCart();
displayCart();
});

function displayCart(){
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray){
        output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>"
        + "<td> ("+ cartArray[i].price + ")</td>"
        + "<td><div class='input-group'>"
        + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "</div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
        + " = "
        + "<td>" + cartArray[i].total + "</td>"
        + "</tr>";
    }  
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
}

// delete item button 
$('.show-cart').on("click", ".delete-item", function (event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
  });

   $('.show-cart').on("change", ".item-count", function (event) {
    var name = $(this).data('name');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  displayCart();

// tab single page 

  $('.tab ul.tab').addClass('active').find('>li:eq(0)').addClass('current');
  $('.tab ul.tab li a').on('click', function(g){
    console.log("click");
var tab = $(this).closest('.tab'),
index = $(this).closest('li').index();
tab.find('ul.tabs > li').removeClass('current');
$(this).closest('li').addClass('current');

tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq('+ index +')').slideUp();
g.preventDefault();
  });


  // search function 

  $('#search_field').on('keyup', function(){
    var value = $(this).var();
    var patt = new RegExp(value, "i");
    $('.tab_content').find('.col-lg-3').each(function(){
        var $table = $(this);
        if(!($table.find('.featured-item').text().search(patt) >=0)){
            $table.hide();
        }
        if(($table.find('.col-lg-3').text().search(patt)>= 0)){
            $(this).show();
            document.getElementById('not_found').style.display = 'none';
        } else {
            document.getElementById("not_found").innerHTML = "product not found..";
            document.getElementById("not_found").style.display = 'block';
        }
    });

  });