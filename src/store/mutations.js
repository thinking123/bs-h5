export const CHANGE_LOADING_BAR = "CHANGE_LOADING_BAR"
const loadQueue = []
export default {
    [CHANGE_LOADING_BAR](state , loadingBarState){
        if (loadingBarState) {
            loadQueue.push(true)
        } else {
            loadQueue.pop()
        }

        state.loading =  loadQueue.length > 0
    },
    setRecordId(state ,id){
        state.recordId = id
    },
    setIsPlaying(state ,isPlaying){
        state.isPlaying = isPlaying
    },
    setIsPlayingRecord(state ,isPlayingRecord){
        state.isPlayingRecord = isPlayingRecord
    },
    setIsStartRecording(state ,isStartRecording){
        state.isStartRecording = isStartRecording
    }
}
