const formMain=document.querySelector('form')
const formSteps=[...document.querySelectorAll('.form-step')]
const formElements=[...document.querySelectorAll('.form-element')]
const previousbtn=document.querySelector('.previous')
const nextbtn=document.querySelector('.next')
const confirmbtn=document.querySelector('.finish')
let currentPage=0


const intialization=()=>{
    
    if (currentPage==0) {
        previousbtn.style.display='none'
        confirmbtn.style.display='none'
        nextbtn.style.display="block"
    }
    else if (currentPage==formElements.length-2) {
        nextbtn.style.display='none'
        confirmbtn.style.display='block'
    }
    else if (currentPage==formElements.length-1) {
        nextbtn.style.display='none'
        previousbtn.style.display='none'
        confirmbtn.style.display='none'
    }
    else if (0<currentPage<(formElements.length-2)) {
        previousbtn.style.display='block'
        nextbtn.style.display='block'
        confirmbtn.style.display='none'
    } 
    

    formElements.forEach((item,index)=>{
        if(index == currentPage) {
            item.dataset.active="true"
            item.querySelectorAll('input,button').forEach(value=>{
                value.toggleAttribute('hidden',false)
            })
            formSteps.slice(0,currentPage+1).forEach(value=>{
                value.dataset.completed="true"
                
            })
        } else {
            item.dataset.active="false"
            formSteps.slice(currentPage+1).forEach(value=>{
                value.dataset.completed="false"
            })
            setTimeout(()=>{
                item.querySelectorAll('input,button').forEach(value=>{
                    value.toggleAttribute('hidden',true)
                })
                if (currentPage-index == 1) {
                    item.dataset.active="backward"
                }
            })
        }
    })
}

const checkValid=(param)=>{
    let valid = true
    if(document.querySelector('[name="Name"]').value==''){
        valid = false
        param.innerHTML="Empty Field!"
    } else if(
        document.querySelector('[name="Email Address"]').value == '' ||
        document.querySelector('[name="Email Address"]').value.indexOf('@') == -1
    ) {
        valid = false
        param.innerHTML="Wrong Email Format!"
    } else if(
        document.querySelector('[name="Phone Number"]').value == ''
    ) {
        valid = false
        param.innerHTML="Empty Field!"
    } else if(
        [...document.querySelectorAll('[name="plan"]')].filter(item=>item.checked).length != 1 &&
        currentPage >= 1
    ) {
        valid = false
        param.innerHTML="No Field Selected!"
    } 

    if (valid==false) {
        param.style.backgroundColor="#fd6044"
        param.style.paddingInline="1rem"
        param.style.color="black"
    } else if (valid==true) {
        param.style.backgroundColor="var(--bg-dark-color)"
        param.style.paddingInline="0rem"
        param.style.color="var(--text-light-color)"        
        param.innerHTML="Next Step"
    }

    
    return valid

}

const getData=()=>{

    document.querySelector('.wrapper').innerHTML=
    `<div class="field">
        <p>
        ${[...document.querySelectorAll('[name="plan"]')].filter(item=>item.checked)[0].value}
        (${document.querySelector('[name="plan-period"]').checked?'Yearly':'Monthly'})
        </p>
        <span>
        ${[...document.querySelectorAll('.radio-label')].filter(item=>item.querySelector('[type="radio"]').checked)[0].querySelector("[data-price]").innerHTML}
        </span>
        </div>
    `
    +
    [...document.querySelectorAll('.check-label')].filter(item=>item.querySelector('[type="checkbox"]').checked)
    .map(value=>`
        <div class="field">
        <p>
        ${value.querySelector('[data-title]').innerHTML}
        </p>
        <span>
        ${value.querySelector('[data-price]').innerHTML}
        </span>
        </div>
        `).join('')
        
        let total = 0
        document.querySelector('[data-total]>p').innerHTML=`Total (${document.querySelector('[name="plan-period"]').checked?'Yearly':'Monthly'})`
        
        document.querySelector('.wrapper').querySelectorAll('span').forEach(item=>{
            total+=parseInt(item.innerHTML.split('').filter(value=>parseInt(value)||parseInt(value)==0).join(''))
        })
        
        document.querySelector('[data-total]>span').innerHTML=`+$${document.querySelector('[name="plan-period"]').checked?total*12+'/yr':total+'/mo'}`
}
document.addEventListener('click',(e)=>{
    if (e.target.classList.contains('CTA')) {
        e.preventDefault()
        currentPage=0
        document.querySelectorAll('[type="text"],[type="email"]').forEach(item=>item.value='')
        document.querySelectorAll('[type="radio"],[type="checkbox"]').forEach(item=>{item.checked?item.checked=false:null})
        document.querySelector('.wrapper').innerHTML=''
        document.querySelector('[data-total]>p').innerHTML=''
        document.querySelector('[data-total]>span').innerHTML=''
    } 
    else
    if (e.target.classList.contains('next')) {
        e.preventDefault()
        
        checkValid(e.target)
        ?currentPage++
        :null
        
        if (currentPage==3) {
            getData()
        }
    } 
    else
    if (e.target.classList.contains('previous')) {
        e.preventDefault()
        currentPage--
    } 
    else
    if (e.target.type=="submit") {
        e.preventDefault()
        currentPage++
    } 
    else
    if (e.target.name=="plan-period") {
        e.target.checked
        ?document.querySelectorAll('.radio-label').forEach(param=>{
            item=param.querySelector('p')
            item.innerHTML=`$${Math.floor(parseInt(item.innerHTML.split('').filter(value=>parseInt(value)||parseInt(value)==0).join(''))*.9)}/mo`
        })
        :document.querySelectorAll('.radio-label').forEach(param=>{
            item=param.querySelector('p')
            item.innerHTML=`$${Math.ceil(parseInt(item.innerHTML.split('').filter(value=>parseInt(value)||parseInt(value)==0).join(''))/.9)}/mo`
        })
    } 
    
    intialization()
})



intialization()