import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
// console.log(Vue);

Vue.component('loader',{ 
    template: `
    <div style="display:flex;justify-content:center;align-items:center;">
        <div class="spinner-border" role="status">
             <span class="sr-only">🎡</span>
        </div>Loading...
    </div>
    `
})

new Vue({
    el:'#app',
    data() {
        return {
            loading:false,
            form:{
                name:"",
                value:""
            },
            //create array that wil hold all the contacts in cards localy
            contacts:[
                //add contact for example with flags set
                // {id:1,name:"Anton",value:"0546-426-242",marked:false}
                //✂was moved to app.js CONTACTS array

            ]
        }
    },
    //computed is a flag,that will  avoid adding empty card or just with spaces
    computed: {
        canCreate(){
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods: {
       async createContact(){
                 //catch the form inputs,and show in console.log()
          console.log(this.form); 
                /*create with destruction new object,that will have name contact,and with rest operator
                 will collect all values that we have in this.form*/
          const {...contact} =this.form
                //check what is contact with console.log()
          console.log(contact); //now we have key 'name',and value that have 'value'
                /*before we will work with the server,we can use this array localy
                but now it doesn't have any ID,that server creates,so instead for now,
                will create contact,and ID will be the time that was created*/
                /*need to add flag marked:false,if not,it will mark only one once and on first card🤷‍♂️,
                that will mark all the card that already added,and will not work on next added cards*/
                /*!!! this.contacts.push({...contact,id: Date.now(),marked:false}); //temporary function,will use for front */
                /*now we updated the array,and we need to see changes in template(html),so going to html,cards div */

          const  newContact = await request('/api/contacts/','POST',contact)
          console.log(newContact);
          this.contacts.push(newContact);
               //clean the form inputs
          this.form.name = this.form.value =""
        },
      async  mark_it(id){
//lets check what is ID
         /*   console.log(id); //will show time in miliseconds,whin it was clicked 😎
            //when we inside mark_it method,we need to find special model from the array contacts,wiil use find()
            const contact = this.contacts.find(special => special.id === id)
            contact.marked=true; */
            const contact = this.contacts.find(special => special.id === id)
          const updatedMark=  await request(`/api/contacts/${id}`,'PUT',{...contact,marked:true})
            contact.marked=updatedMark.marked //synchronously update back and front
        },
      async  remove(id){
            //will use filter() method,that filters this array and return new array,that was changed
           /* this.contacts = this
            .contacts
            .filter(chosenContact => chosenContact.id !== id)*/ /* if  contact id equals id that put inside remove(),it means that need to remove this element */
           await request(`/api/contacts/${id}`,'DELETE')
           this.contacts = this.contacts.filter(chosenContact => chosenContact.id !== id)
        }
    },
    async mounted(){
        console.log('ready?');
        this.loading=true;
        //url adress in request param,will be '/',in reason we at same port,so its actually fake url🎃
        /*usually when working with api, we need to use /api prefix ((we still dont have it)) and who with we working*/
      //also will add this route to GET at app.js
        // const data = await request('/api/contacts')
        // console.log(data);
        // we can se the info  in network/preview
        //make alive connection with back-end and show  it in frontend
        // this.contacts=data;
        this.contacts= await request('/api/contacts')
        this.loading=false;
    }
})

//create async function that will make request to server
async function request(url,method='GET',data=null){
    try{
        const headers = {} // metha info that informs us what is happening to request
       let body 
        //check if data not empty
          if(data) {
              //with this header,i say that this content is type of json 
            headers['Content-Type'] = 'application/json'
            //turns objects to string,bcause regular objects of javascript we cant send them by net
            body=JSON.stringify(data)
          }
//create object response,and wait till promise fetch completes
      const response = await fetch( url,{
            method,  //leave it like this,b'cause we already have it in our parameters
            headers,
            body
        })
        return await response.json()
    }catch(err){
        console.warn('Error',err.message);
    }
}