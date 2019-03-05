import {Howl, Howler} from 'howler'
import store from '../store'
const keys = [
    "do",
    "re",
    "mi",
    "fa",
    "sol",
    "la",
    "xi"
]

class MusicPlay{
    constructor(){

    }

    loadMusic(src){
        return new Promise((resolve , reject) =>{
            const sound = new Howl({
                src,
                onload:res=>{
                    console.log('loaded ok' , res)
                    resolve(sound)
                },
                onloaderror:err=>{
                    console.log('loaded music fail' , err)
                    reject(err)
                }

            })
        })
    }
    allMusic(){
        const base = store.state.base
        const mlist = keys.map(m=>{
            const r = `${base}rhythm-select-${m}.mp3`
            return this.loadMusic(r)
        })

        return Promise.all(mlist)
    }
    async init(){
        // const mus = await this.allMusic()

        // const mlist = keys.map(async m=>{
        //     const r = `${base}rhythm-select-${m}.mp3`
        //     const res = await this.loadMusic(r)
        //     return res
        // })


return
        const musObj = {}
        const base = store.state.base
        for(let i = 0 ; i< keys.length ; i++){
            const r = `${base}rhythm-select-${keys[i]}.mp3`
            musObj[keys[i]] = await this.loadMusic(r)
        }

        this.musObj = musObj
    }

    play(key){
        const music = this.musObj[key]
        if(music){
            // music.playing && music.stop()
            music.play()
        }else{
            console.error("music not exist")
        }
    }

    stop(key){
        const music = this.musObj[key]
        if(music){
            music.stop()
        }else{
            console.error("music not exist")
        }
    }
}

const music = new MusicPlay()

export default music