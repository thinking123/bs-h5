import store from '../store'
import {isIphone} from "./common";
import {CHANGE_LOADING_BAR} from "../store/mutations";

function getSoundList() {
    const keys = [
        'do',
        're',
        'mi',
        'fa',
        'sol',
        'la',
        'xi',
    ]

    const base = store.state.base
    return keys.map(k=>{

        return {
            src:`${base}rhythm-select-${k}.mp3`,
            id:k
        }
    })
}

class SoundPlay {
    /**
     *
     * lists:[{id:'' , src:''}]
     * */
    constructor(){
        console.log('init sound')
        this.lists = getSoundList()
        this.ids = {}
        this.lists.forEach(l=>this.ids[l.id] = l.id)

        console.log(this.ids)
        this.queue = new createjs.LoadQueue()
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
        createjs.Sound.alternateExtensions = ["mp3"];
        this.queue.installPlugin(createjs.Sound);
        this.queue.on('fileload' , this.handleFileLoad)
        this.queue.on('complete' , this.handleComplete)

    }

    load(){
        console.log('start load music')
        store.commit('CHANGE_LOADING_BAR', true)
        this.queue.loadManifest(this.lists)
    }
    handleFileLoad(e){
        console.log('handleFileLoad' , e)
    }

    handleComplete(e){
        store.commit('CHANGE_LOADING_BAR', false)
        if(isIphone()){
            // createjs.WebAudioPlugin.playEmptySound();
        }
        console.log('handleComplete' , e)
    }

    play(id){
        if(this.ids[id]){
            createjs.Sound.play(id)
        }else{
            console.log(id , 'not exist play')
        }
    }

    stop(id){
        if(this.ids[id]){
            try {
                console.log('stop music')
                createjs.Sound.stop()
            }catch (e) {
                console.error('error music' , e)
            }

        }else{
            console.log(id , 'not exist stop')
        }
    }
}

export default SoundPlay