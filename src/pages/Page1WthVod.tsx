import { useState,useRef, useEffect } from 'react'
import pinkPanther from '../PinkPanther30.wav'
import MsgWrapper from '../components/MsgWrapper';
import { v4 as uuidv4 } from 'uuid';
import WavToMp3 from '../functions/wavToMp3';
import vittLogo from './assets/vitt-logo.png'
import vad from 'voice-activity-detection'
//import { createFFmpeg} from '@ffmpeg/ffmpeg';


export default function CuePage(){

  
  let [responseType,setResponseType] = useState<string>("insurance") 
  //let recordingOn:boolean = true;
  
  type Transcript = {
    transcript:string
  }

  type responseData = Transcript[] |[]

  let myId:string = uuidv4();
  let [msg,setMsg] = useState<responseData>([]);
  
  type progressBarType = {
      uploaded:number,
      hidden:boolean 
    }

  
  const [audiofile,setAudioFile] = useState<any>("");
  const audioPlayerRef = useRef<HTMLAudioElement>(null!)
  const [url1,setUrl1] = useState<string>("http://localhost:5174/")
  const [url2,setUrl2] = useState<string>("") 
  const timeRef = useRef(null)
  
  let timeStampRef =useRef<Date|null>(null)
  let lastTimeSpeak = useRef<Date|null>(null)
  let streamRef = useRef<MediaStream|null>(null)
  let [toggleRecording,setToggleRecording] = useState<any>({recordingOn:false,recordingTime:null});
  let toggleRecordingRef = useRef<any>({recordingOn:false,recordingTime:null});
  let mediaRecorderRef = useRef<any>(null)
    let meanRef = useRef({ mean:0,count:1,oldValue:0})

  function sendToServer(blob:any,url:string){
    //console.log(blob)
    let reader = new FileReader()
    reader.onloadend = ()=>{
      let base64data:any = reader.result;
     // console.log(`base64`,base64data)
     let date = new Date() 
     fetch(url,{
        method:'POST',
        headers:{
           'Accept':'application.json',
           'Content-Type':'application/json'
        },

        body:JSON.stringify({
            audiomessage:base64data.split(',')[1],
            uid:myId,
            mob:responseType,
            timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
            
        }),
        cache:'default',}).then(res=>{
           console.log("res from audio server",res)
           return res.json()
        }).then((result)=>{
          
          //setMsg((prev)=>[...prev,...result])
          console.log(result)
        })

    }
   reader.readAsDataURL(blob)
  }

  function startMediaRecorder(stream:MediaStream,time:number){
       
    //let url = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
    console.log("media recorder triggered")
    let url = url1
     let arrayofChunks:any = []
       let mediaRecorder = new MediaRecorder(stream,{
         audioBitsPerSecond:32000
         })
        mediaRecorderRef.current =mediaRecorder
     mediaRecorder.ondataavailable = (e)=>{ 
       arrayofChunks.push(e.data)
     }
     
     mediaRecorder.onstop = async ()=>{
     
     //let url = `https://asia-south1-utility-range-375005.cloudfunctions.net/save_b64_1`
     //let url = `https://0455-182-72-76-34.ngrok.io`
     mediaRecorderRef.current=null
     let mp3Blob = await WavToMp3(new Blob(arrayofChunks,{type:'audio/wav'}))
     //console.log(mp3Blob)
     sendToServer( mp3Blob,url)
      arrayofChunks = []
     }
     //setTimeout(()=>mediaRecorder.stop(),time)
 
     //if recording true stop after 30 sec
     let timeOutId = setTimeout(()=>{
      if(mediaRecorder.state==='recording')
      mediaRecorder.stop()
     },time)
     //chk every second 
     let intervalId = setInterval(()=>{
       if(toggleRecordingRef.current.recordingOn ===false){
         clearInterval(intervalId) 
          clearTimeout(timeOutId)
        if(mediaRecorder.state==='recording')
         mediaRecorder.stop()
         
       }
       
     },1000)
     mediaRecorder.start()
     
   }

   function diffSec(d2:Date,d1:Date){
    let seconds =( d2.getTime() - d1.getTime() )/1000
    
    return seconds;
   }

   function diffMilli(d2:Date,d1:Date){
     //  console.log(d2,d1)
    return d2.getTime() - d1.getTime()
   }

   function recordingOff(){
    console.log(toggleRecording)
    toggleRecordingRef.current.recordingOn = false
    toggleRecordingRef.current.recordingTime = null
    //@ts-ignore 
    
    setToggleRecording((prev:any)=>({ 
     recordingOn:false ,
     recordingTime: null
     }))
   }
    function recordingOn(){
        let d= new Date()

        lastTimeSpeak.current = d;

        console.log(toggleRecording)
        toggleRecordingRef.current.recordingOn = true
        toggleRecordingRef.current.recordingTime = d
        //@ts-ignore 
        
        setToggleRecording((prev:any)=>({ 
         recordingOn:true,
         recordingTime:d
         }))
    }

    useEffect(()=>{
        console.log(toggleRecording)
    },[toggleRecording])
    
    function recordingTime(){
        let d = new Date()
        console.log(d.toTimeString())
    }
    
    function onStop(data:any){
      console.log("stopped")
    } 

    function onStart(){
      console.log("started")
    }

    function onUpdate(e:any){
      
    //     if(toggleRecordingRef.current.recordingOn===false)
    //         return;
    //    // let {mean,count,oldValue } = 
        

    //     let new_mean 
    //     const taking_mean_of =20
    //     if(meanRef.current.count<=taking_mean_of){
          
    //       new_mean= ((meanRef.current.mean *meanRef.current.count)+e )/(meanRef.current.count+1);
    //       meanRef.current.mean = new_mean
    //       meanRef.current.oldValue=e
    //       meanRef.current.count++;
          
    //     }else{
          
    //       new_mean= ((meanRef.current.mean * taking_mean_of) - meanRef.current.oldValue +e )/taking_mean_of
    //       meanRef.current.mean = new_mean
    //       meanRef.current.oldValue=e 
    //       meanRef.current.count++
    //     }
        
        
    //     if(new_mean>0.2 && timeStampRef.current===null){
    //        // console.log(e)
    //         //set local time stamp to keep track of speaking
    //         timeStampRef.current = new Date()
    //         lastTimeSpeak.current = null;
    //     }else if(new_mean<=0.2 && timeStampRef.current!=null){
    //         //stop speaking
    //        // console.log(e)
    //        timeStampRef.current = null;
    //        lastTimeSpeak.current = new Date()
    //     }
    
    //     let d = new Date()
         
        
    //     //@ts-ignore
    // console.log(new_mean,lastTimeSpeak.current !=null ? diffSec(d,lastTimeSpeak.current):null,
    // timeStampRef.current!=null ?
    //         diffMilli(d,timeStampRef.current):null
    // )

    //     if(
    //         timeStampRef.current!=null && 
    //         diffMilli(d,timeStampRef.current) > 200 && 
    //         mediaRecorderRef.current ===null ){  
    //         //@ts-ignore
    //         //console.log("recording started")
    //         recordingTime()
    //         //@ts-ignore
    //         startMediaRecorder(streamRef.current,30000)
    //         //@ts-ignore
    //     }else if(lastTimeSpeak.current !=null && diffSec(d,lastTimeSpeak.current)>10){
    //         //resetting button
    //         console.log("button stoped")
    //         recordingOff()

    //         timeStampRef.current=null;
    //         lastTimeSpeak.current=null;

    //         meanRef.current.mean=0
    //         meanRef.current.count=1
    //         meanRef.current.oldValue=0


   //     } 
    
        }

  
    useEffect(()=>{
         
    let option = {
        onUpdate: onUpdate,
        onVoiceStop:onStop,
        onVoiceStart:onStart
    }
    navigator.mediaDevices.getUserMedia({
        audio:true
      }).then(stream=>{
        streamRef.current = stream;
        let Context = window.AudioContext
        let audioCtx = new Context()
        //@ts-ignore
        vad(audioCtx,stream,option) 
        
    })

    },[])
 

  return (
    <div className="App">
        <div className='header'>
            <img src={vittLogo}/>
        </div>
        {/* <h1>Jarvis Recording & Cues Project</h1> */}
      
        <div className='player'>
          {/* <audio controls ref={audioPlayerRef}></audio> */}
          {/* <h4>{audiofile.name}</h4> */}
        </div>
        <div>
            <input 
            className='urlInput'
              type="text" 
              placeholder="Enter url " 
              value={url1} 
              onChange={(e)=>{setUrl1(e.target.value);setUrl2(e.target.value)}} 
            />
        </div>
        <div className="fileInputs">
            
            {/* <div>
            
              <label htmlFor="fileInput">Select Audio File</label>
                <input 
                  type="file"
                  name="fileInput" 
                  id="fileInput"
                  accept=".mp3,.wav,.aac"
                  onChange={(e)=>selectAudio(e)} 
                  /> 
                <button disabled={!progress.hidden} onClick={()=>{setMsg([]);sendFileToServer()}}>Upload</button>
            </div>
             */}
            {/* <div className='progressive' style={{display:progress.hidden?`none`:'block'}}> 

              <progress className="progressBar" value={progress.uploaded} max="100" ></progress>
              <p>{progress.uploaded}%</p>
            </div> */}
        </div>
        <div>
          {/* <input 
              type="text" 
              placeholder="Enter url for base64" 
              value={url2} 
              onChange={(e)=>setUrl2(e.target.value)} 
            /> */}
        </div>
        <div className='recording'>
          <button className='recordBtn'
            style={{backgroundColor:toggleRecording.recordingOn? 'red':'rgb(80 31 159)'}} 
            onClick={()=>toggleRecordingRef.current.recordingOn===false ? recordingOn():recordingOff()}
            >{toggleRecording.recordingOn? `Recording...`:`Start Recording`}
          </button>
        </div>

        <div >
            <label htmlFor="cars">Choose an option:</label>

            <select id="cars" onChange={e=>setResponseType(e.target.value)}>
              <option value="insurance" >Insurance</option>
              <option value="wealth">Wealth</option>
              
            </select>
        </div>
      <MsgWrapper />
    </div>
  )
}

