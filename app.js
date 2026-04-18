
console.log("Hello Krishna ");

const API_URL='https://fakestoreapi.com/products'
const application_enum = {
    'CART_KEY':'cart'
}
const cards_container = document.getElementById("cards_container")
const single_product_container = document.getElementById("single_product_container")
const cart_items_qty = document.getElementById("cart_items_qty")
const cart_container = document.getElementById("cart_container")
const total_price = document.getElementById("total_price")

let single_product = {}
let all_product = []
let cart_product = JSON.parse(localStorage.getItem(application_enum.CART_KEY) ||"[]")

function PrintToast({title,text,icon='success'}){
    Swal.fire({
        title: title,
        text: text,
        icon: icon
      })
}

function printDataToScreen(){
 
     let str = ''
    for(let i=0;i<all_product.length;i++){
            
        str+=`  <div class="p-3 col">
                            <div class="card" style="width: 18rem;">
                                <img src="${all_product[i].image}" class="card-img-top" alt="..." style="height: 200px; object-fit: cover;">
                                <div class="card-body">
                                  <h5 class="card-title">${all_product[i].title}</h5>
                                  <span class="load bg-success px-0 py-1 my-2 text-white">
                                    <span class="alert alert-success py-1">${all_product[i].category}</span>
                                    &#8377; ${all_product[i].price}/- </span>
                                  <p class="card-text">${all_product[i].description.substring(0,100)}...</p>
                                  <a href="/product.html?product=${all_product[i].id}" class="btn btn-primary">View</a>
                                </div>
                              </div>
                     
                        </div>`
   }
    
   cards_container.innerHTML = str
}

async function GetAllProduct(){
    if(!cards_container) return
       cards_container.innerHTML =`
            <div class="d-flex justify-content-center align-items-center" style="min-height:80vh;">
            <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
	<circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
	<circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
</svg>
            </div>
       
       `
   try {
            const response = await fetch(API_URL,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })

           
            const data = await response.json()
            all_product = data
            printDataToScreen()

   } catch (error) {
    console.log(error);
    
    PrintToast({title:'error',text:error.message,icon:'error'})
   }
    
}


async function GetSingleProduct(){
    if(!single_product_container) return

    single_product_container.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height:80vh;">
    <div class="loader"></div>
    </div>
    `
    try {
        const url = new URL(window.location.href)
           const response = await fetch(API_URL+`/${url.searchParams.get("product")}`,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
           })
           const data = await response.json()
           single_product =data
           
           let str_tempalte = ` <div class="col-md-10">
                <div class="card">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="images p-3">
                                <div class="text-center p-4"> <img id="main-image" src="${data.image}" width="250" /> </div>
                                
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="product p-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div onclick="goBackFunction()" class="d-flex align-items-center pe-auto"> <i class="fa fa-long-arrow-left"></i> <span class="ml-1">Back</span> </div> <i class="fa fa-shopping-cart text-muted"></i>
                                </div>
                                <div class="mt-4 mb-3"> <span class="text-uppercase text-muted brand">${data.category}</span>
                                    <h5 class="text-uppercase">${data.title}</h5>
                                    <div class="price d-flex flex-row align-items-center"> <span class="act-price">&#8377; ${data.price}</span>
                                         
                                    </div>
                                </div>
                                <p class="about">${data.description}</p>
                                
                                <div class="cart mt-4 align-items-center"> <button onclick="AddToCart()" class="btn btn-danger text-uppercase mr-2 px-4">Add to cart</button> <i class="fa fa-heart text-muted"></i> <i class="fa fa-share-alt text-muted"></i> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
           
            single_product_container.innerHTML =str_tempalte
            
    } catch (error) {
    console.log(error);

    PrintToast({title:'error',text:error.message,icon:'error'})
        
    }
}






window.addEventListener("load",function(){
    GetAllProduct()
    GetSingleProduct()
    if(cart_items_qty){

        cart_items_qty.innerHTML =`(${cart_product.length})`
    }
     PrintCartContainer()
     updateCheckOutPrice()
     showThankuPageId()
})

function goBackFunction(){
    window.history.back()
}

//  function of add to cart 


function AddToCart(){
    delete single_product.rating
    delete single_product.category
    delete single_product.description

    const checkExist = cart_product.find((cur)=>cur.id === single_product.id)
    if(!checkExist){
        const item = {
            ...single_product,
            qty:1
        }
        PrintToast({title:'Success',text:'Item Added :)',icon:'success'})
        cart_product.push(item)
    }else{
       const updated_cart = cart_product.map((cur)=>{
        if(cur.id === single_product.id){
            return {
                ...cur,
                qty:cur.qty+1
            }
        }
        return cur
       }) 
       PrintToast({title:'Success',text:'Qty Increase :)',icon:'success'})

       cart_product =updated_cart
    }
    cart_items_qty.innerHTML =`(${cart_product.length})`
 
    localStorage.setItem(application_enum.CART_KEY,JSON.stringify(cart_product))
    
}

function PrintCartContainer (){
        let str = ''
        if(!cart_container) return

        if(cart_product.length<1){
            cart_container.innerHTML = `<div class="container-fluid  mt-100">
				 <div class="row">
				 
					<div class="col-md-12">
					
							<div class="card">
						<div class="card-header">
						<h5>Cart</h5>
						</div>
						<div class="card-body cart">
								<div class="col-sm-12 empty-cart-cls text-center">
									<img src="/image.png" width="130" height="130" class="img-fluid mb-4 mr-3">
									<h3><strong>Your Cart is Empty</strong></h3>
									<h4>Add something to make me happy :)</h4>
									<a href="/" class="btn btn-primary cart-btn-transform m-3" data-abc="true">continue shopping</a>
									
								
								</div>
						</div>
				</div>
						
					
					</div>
				 
				 </div>
				
				</div>`
                return
        }

    for(let i=0;i<cart_product.length;i++){
        str+=`
           <div class="mb-3 border shadow row py-3 bg-white rounded">
                                <div class="col-sm-3 d-flex align-items-center ">
                                    <img src="${cart_product[i].image}" alt="" style="width: 50%; height: 100px; object-fit: cover;">
                                </div>
                                <div class="col-sm-9">
                                    <h3>${cart_product[i].title}</h3>
                                    <h4>&#8377;${cart_product[i].price}X${cart_product[i].qty} = ${cart_product[i].price*cart_product[i].qty}/- </h4>
                                        <div class="btn-group">
                                            <button onclick="DecrementItem(${cart_product[i].id})" type="button" class="btn btn-danger">-</button>
                                            <button type="button" class="btn btn-info fw-bold text-white">${cart_product[i].qty}</button>
                                            <button onclick="IncrementItem(${cart_product[i].id})" type="button" class="btn btn-success">+</button>
                                        </div>
                                        <div class="btn-group">
                                            <button onclick="RemoveItem(${cart_product[i].id})" class="btn btn-danger btn-sm"><i class="bi bi-trash"></i> Delete</button>
                                        </div>
                                </div>
                            </div>
        `
    }
 
    if(cart_container){

        cart_container.innerHTML =str
    }

}

function IncrementItem(id){
        try {
           const checkExist = cart_product.find((cur)=>cur.id == id);
           if(!checkExist){
            throw new Error("item Not Exist")
            return
           } 

            const updated_cart = cart_product.map((cur)=>{
                if(cur.id == id){
                    return {
                        ...cur,
                        qty:cur.qty+1
                    }
                }
                return cur;
            })
            cart_product =updated_cart
            PrintToast({
                title:'success',
                text:'Qty Increase',
                icon:'success'
            })
            localStorage.setItem(application_enum.CART_KEY,JSON.stringify(cart_product))
            updateCheckOutPrice()
            PrintCartContainer()

        } catch (error) {
    PrintToast({title:'error',text:error.message,icon:'error'})
            
        }
} 

function DecrementItem(id){
    try {
       const checkExist = cart_product.find((cur)=>cur.id == id);
       if(!checkExist){
        throw new Error("item Not Exist")
        return
       } 
       if(checkExist.qty<=1){
        const updated_cart = cart_product.filter((cur)=>cur.id != id)
        cart_product =updated_cart

        PrintToast({
            title:'success',
            text:'Item Removed',
            icon:'success'
        })
       }else{

           
           const updated_cart = cart_product.map((cur)=>{
               if(cur.id == id){
                   return {
                       ...cur,
                       qty:cur.qty-1
                    }
                }
                return cur;
            })
            cart_product =updated_cart
            PrintToast({
                title:'success',
                text:'Qty Decrease',
                icon:'success'
            })
        }
        localStorage.setItem(application_enum.CART_KEY,JSON.stringify(cart_product))
        cart_items_qty.innerHTML =`(${cart_product.length})`
        updateCheckOutPrice()
        PrintCartContainer()

    } catch (error) {
PrintToast({title:'error',text:error.message,icon:'error'})
        
    }
} 
function RemoveItem(id){
    try {
       const checkExist = cart_product.find((cur)=>cur.id == id);
       if(!checkExist){
        throw new Error("item Not Exist")
        return
       }  
        const updated_cart = cart_product.filter((cur)=>cur.id != id)
        cart_product =updated_cart

        PrintToast({
            title:'success',
            text:'Item Removed',
            icon:'success'
        })
       
        localStorage.setItem(application_enum.CART_KEY,JSON.stringify(cart_product))
        cart_items_qty.innerHTML =`(${cart_product.length})`
        updateCheckOutPrice()
        PrintCartContainer()

    } catch (error) {
PrintToast({title:'error',text:error.message,icon:'error'})
        
    }
} 


function updateCheckOutPrice(){
        if(!cart_product || !total_price) return
    const price  = cart_product.map((cur)=>cur.price*cur.qty).reduce((ac,cur)=>ac+cur,0)

    total_price.innerText = price

}


function checkOutForm(e){
    e.preventDefault()
    const formData = new FormData(e.target)

    let obj = {}
    obj['name']  =formData.get("name")
    obj['email']  =formData.get("email")
    obj['address']  =formData.get("address")
    e.target.reset()
    // api calling
    console.log(obj);
    localStorage.clear()
    const order_id = `CARTIFY_SHOP`+Math.floor(Math.random()*788858)
    PrintToast({
        text:"Item Placed",
        title:"Success",
        icon:'success'
    })
    window.location.href = "/thanku.html?order_id="+order_id
    
    
}

function showThankuPageId(){
    const doc = document.getElementById("order_id")
    if(!doc) return;

    const url = new URL(window.location.href)
    const order_id = url.searchParams.get("order_id")
    doc.innerText  = order_id
}