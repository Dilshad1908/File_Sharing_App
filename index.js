const dropZone=document.querySelector(".drop-zone");
const fileInput=document.querySelector("#fileinput");
const browseBtn=document.querySelector(".browseBtn");

const bgProgress=document.querySelector(".bg-progress");
const progressBar=document.querySelector(".progress-bar");
const progressContainer=document.querySelector(".progress-container");
const percentDiv=document.querySelector("#percent");
const sharingContainer=document.querySelector(".sharing-container")
const fileURLInput=document.querySelector("#fileURL");
const copyBtn=document.querySelector("#copyBtn");
const emailForm=document.querySelector("#emailForm")
const emailInput=document.querySelector(".email")
const toast=document.querySelector(".toast")

const host="https://sharedil.onrender.com"
const uploadURL=`${host}/api/file`
const emailURL=`${host}/api/file/send`

// dragging ///
dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    // console.log('dillu is drangging.......')
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");

    }
})

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragged");
})

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    // console.log(e.dataTransfer.files.length);
    // console.log(e)
    const files=e.dataTransfer.files;
    // console.log(files)
    if(files.length){
        fileInput.files=files;

        uploadFile();
    }
})

// setting browse to file ///

browseBtn.addEventListener("click",()=>{
    fileInput.click();

})
// for uploading by browsing

fileInput.addEventListener("change",()=>{
    uploadFile();
})

// for copy the link 

copyBtn.addEventListener("click",()=>{
    fileURLInput.select();
    document.execCommand("copy")
    showToast("Link copied")
})
// uploading file //


const uploadFile=()=>{
    progressContainer.style.display= "block";
    const file = fileInput.files[0];
    const formData=new FormData()
    formData.append("myfile",file)

    const xhr=new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
        // console.log(xhr.readyState)
        if(xhr.readyState===xhr.DONE){
            console.log(xhr.response)
            showLink(JSON.parse(xhr.response))
        }
    }

    // upload progress

    xhr.upload.onprogress=updateProgress;
    xhr.upload.onerror=()=>{
        fileInput.value="";
        showToast( `Error in upload:${xhr.statusText}`);

    }

    xhr.open("POST",uploadURL);
    xhr.send(formData)
}

const updateProgress=(e)=>{
    // console.log(e.loaded)
    // const percent=(e.loaded/e.total)*100
    // console.log(percent)
    const percent=Math.round((e.loaded/e.total)*100)
    bgProgress.style.width=`${percent}%`
    percentDiv.innerHTML=percent;
    progressBar.style.transform=`scaleX(${percent/100})`
}
const showLink=({file:url})=>{
    console.log(url)
    emailForm[2].removeAttribute("disabled")
    
    progressContainer.style.display="none"
    fileURLInput.value=url;
    sharingContainer.style.display="block"
    
}

emailForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log('form submitted')
    const url=fileURLInput.value;
    const formData={
        uuid:url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements["to-email"].value,
        emailFrom:emailForm.elements["from-email"].value  
    } 
    console.table(formData)

    fetch(emailURL,{
        method:"POST",
        headers:{
            "content-type":"application/json",
        },
        body:JSON.stringify(formData)
    }).then((res) => res.json())
    .then(({success})=>{
        if(success){
            emailInput.value=""
            showToast("Email Sent")
            // sharingContainer.style.display="none"
            // emailForm[2].setAttribute("disabled","true")
        }
    } )
    


})
let toastTimer;
const showToast=(mess)=> {
    toast.innerHTML=mess;
    toast.style.transform="translate(-50%,25%)"
    clearTimeout(toastTimer)
     toastTimer=setTimeout(() => {
        toast.style.transform="translate(-50%,135%)"
    }, 1500);
    
    
}

// fetch(emailURL,{
//     method:"POST",    
//     //  method konsa hai isliye
//     headers:{
//         "content-type":"application/json",
//     },
//     //  headers me kis type ka data jayega
//     body:JSON.stringify(formData) 
//     // body me hamare data ko string me convert karne k liye
// }).then((res) => res.json())
// }).then((res) => res.json())
// ye string me change kar dega 
// .then((data) => console.log(data))
// ye is  post request ka rsponse dega jo hamne backend me set kar rakha hai

// })