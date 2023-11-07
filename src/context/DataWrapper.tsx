import React, { useState,createContext, useContext, useEffect, useRef } from 'react'
import AddOnlySuggestiveMsg from '../components/AddOnlySuggestiveMsg'
import AddTextMsg from '../components/AddTextMsg'
import {io} from 'socket.io-client';
import {v4 as uuidv4} from 'uuid'

const Context = createContext('')
type Data = {
        type:string,
        query: string, 
        label:string,
        replies: string[],
        color: string,
        iconColor:string,
        similarity_query:string,
        imageurl:string,
        value:string,
        radio:string[],
        content:string[],
        id:string,
        iconName:string,
        imageUrl:string,
        sessionid :string,
        audiofiletimestamp:string,
        loading:boolean
        initquery:boolean
        istranscription:boolean
} 
export function useData(){
    return useContext(Context)
}
 
export default function DataWrapper({children}:{children:React.ReactNode}) {
    
    const [data,setData] = useState<Object[]>([])
    let url1 =`vitt-ai-request-broadcaster-production.up.railway.app`
    //let url2 = 'http://localhost:5000'
    const socket = io(url1)
    const [SESSION_ID,setSessionId] = useState('') 
    const tempRef = useRef("")
    const [msgLoading,setMsgLoading] = useState<boolean>(false);
    const [audioArr,setAudioArr] = useState<any>([])
    let audioUrlRef = useRef(null)
    const [audioUrlFlag,setAudioUrlFlag] = useState<boolean>(false)

    let Data = {
        color: "#7D11E9",
        content: ['Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.'],
        iconColor: "blue",
        initquery: "what is mutual fund? what is mutual fund? is mutual fund what is mutual fund what is mutual fund",
        match_score: "0.9741857",
        matched_query: "what is a mutual fund",
        query: ['what is a mutual fund'],
        raw_modded_query: "what is mutual fund fund",
        sessionid: ['aff2b452-5014-4132-8d6d-6ccfa8d520b1'],
        similarity_query: "Definition of mutual fund",
        istranscription:true
    }
    

    function handleAudio(base64:string,filename:string){
        //@ts-ignore
        setAudioArr(prev=>[...prev,{base64:base64,filename:filename}])
    }
    function handleData(data:any){
        setMsgLoading(false)
        let arr:Data[] =[]
        //@ts-ignore
        let obj:Data = {}
// "sessionid": <str>, "audiofiletimestamp": <str>
        
        if(data?.loading){
            return ;
        }
        if(data?.audiourl!=null){
            audioUrlRef.current = data.audiourl
            setAudioUrlFlag(prev=>!prev)
            //setAudioUrl('https://files.gospeljingle.com/uploads/music/2023/04/Taylor_Swift_-_August.mp3')
        }
        if(data?.imageurl){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="ImageMsg"
            obj["imageUrl"] = data.imageurl;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["similarity_query"] = data.similarity_query;
            obj["color"]= data.color;
            obj["iconColor"] = data.iconColor 
            obj["sessionid"] = data.sessionid;
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["istranscription"] = data.istranscription
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj = {}
        }
        if(data?.value){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="InputForm"
            obj["iconName"] = "fa-regular fa-pen-to-square"
            obj["value"] = data.value 
            obj["label"] = data.label 
            obj["color"] = data.color 
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["istranscription"] = data.istranscription
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj = {}
        }
        if(data?.radio){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"]="RadioForm"
            obj["iconName"] = 'fa-regular fa-pen-to-square'
            obj["label"] = data.label 
            obj["radio"] = data.radio
            obj["color"] = data.color
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["istranscription"] = data.istranscription
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj={}
        }
        if(data?.content){
            data.content.map((e:any,i:number)=>{
                //@ts-ignore
                obj["id"]= uuidv4()
                obj["type"]="TextMsg"
                obj["content"] = e 
                obj["iconName"] = 'fa-solid fa-circle-question'
                obj["color"]= data.color 
                obj["iconColor"] = data.iconColor
                obj["similarity_query"] = data.similarity_query;
                obj["sessionid"] = data.sessionid
                obj["audiofiletimestamp"]=data.audiofiletimestamp
                obj["istranscription"] = data.istranscription
                //arr.push(obj)
                arr = [obj,...arr]
                //@ts-ignore
                obj={}
            })
            
        }
        // if(data?.initquery.length>"1"){
        //         obj["id"]= uuidv4()
        //         obj["type"]="TextMsg"
        //         obj["content"] = data.initquery
        //         obj["iconName"] = 'fa-solid fa-circle-question'
        //         obj["color"]= data.color 
        //         obj["iconColor"] = data.iconColor
        //         obj["similarity_query"] = "Transcription captured";
        //         obj["sessionid"] = data.sessionid
        //         obj["audiofiletimestamp"]=data.audiofiletimestamp
        //         obj["initquery"] = true
        //         //arr.push(obj)
        //         arr = [...arr,obj]
        //         //@ts-ignore
        //         obj={}
        // }
        if(data?.replies){
            //@ts-ignore
            obj["id"]= uuidv4()
            obj["type"] = "SuggestiveMsg"
            obj["replies"] = data.replies
            obj["color"] = data.color
            obj["iconColor"] = data.iconColor 
            obj["similarity_query"] = data.similarity_query;
            obj["iconName"] = 'fa-solid fa-forward-fast'
            obj["sessionid"] = data.sessionid
            obj["audiofiletimestamp"]=data.audiofiletimestamp
            obj["istranscription"] = data.istranscription
            //arr.push(obj)
            arr = [obj,...arr]
            //@ts-ignore
            obj={}
           
        } 

       console.log(arr)
       setData(prev=>[...arr,...prev])
       //console.log(obj)
    }

    useEffect(()=>{
        console.log(data)
    },[data])

    useEffect(()=>{
        console.log('i am session id at data-wrapper',SESSION_ID)
    },[SESSION_ID])

    useEffect(()=>{
        if(SESSION_ID==='' && socket.id===undefined )
        return;

        function onConnect(){
                console.log("connection established");
                console.log(socket.id)
             socket.emit('join-room',SESSION_ID,socket.id)
        }
        function onDisconnect(){
            console.log("disconnected")
        }

       socket.on("connect",onConnect)
       socket.on("disconnect",onDisconnect)

       return ()=>{
           socket.off("connect",onConnect)
           socket.off('disconnect',onDisconnect)
       }
    },[SESSION_ID,socket])

    useEffect( ()=>{
        //handleData(Data)
        
        function receiveData(data:any){
                console.log(data);
                if(tempRef.current ===data){
                    //console.log("tempRef current",tempRef.current)
                    return ;
                }
                console.log(data.sessionid ===SESSION_ID,data.sessionid,SESSION_ID)
                if(data.sessionid === SESSION_ID){
                handleData(data)
               // handleAudio(data.speech_bytes,data.file_name)
                }
        }
        socket.on("receive-data",receiveData)
        return ()=>{
            socket.off("receive-data",receiveData)
        }
    },[SESSION_ID])

    let values = {
        data,
        setData,
        SESSION_ID,setSessionId,
        msgLoading,
        setMsgLoading,
        audioArr,
        audioUrlFlag,audioUrlRef
    }
  return (
      //@ts-ignore
    <Context.Provider value={values}>
        {children}
    </Context.Provider>
  )
}
