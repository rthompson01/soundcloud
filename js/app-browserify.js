"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
    // es6 polyfills, powered by babel
require("babel/register")

var $ = require('jquery')
var Backbone = require('backbone')
var React = require('react')
var Promise = require('es6-promise').Promise
var key = "30aa44007c9dbf095d163b5b8a4d6d2e";
var secret= "9bb09d7d31409e38e956cc8edda544a4";
var search_value= "";
 SC.initialize({
         client_id: '30aa44007c9dbf095d163b5b8a4d6d2e'
     });

import * as templates from "./templates.js"
// SC.initialize({
//   client_id: 'YOUR_CLIENT_ID'
// });

// var track_url = 'http://soundcloud.com/forss/flickermood';
// SC.oEmbed(track_url, { auto_play: true }, function(oEmbed) {
//   console.log('oEmbed response: ' + oEmbed);
// });
// 

var qs = (s, d) => (d || document).querySelector(s)

var SoundcloudCollection = Backbone.Collection.extend({
    url :function() {
        return `https://api.soundcloud.com/tracks.json?client_id=${key}&q=${this.search_value}`
    }
}
)



class SoundcloudItem extends React.Component {
        constructor(props) {
     super(props)
     this.props.item
     this.state = {
        playing: false,
        sound: null,
        volume:1,
        time: 0,
     }

 }
   _streamAndStop(e) {
     console.log('play clicked')

     this.setState({playing: !this.state.playing})
     
     var track_id = this.props.item.id,
         play_button = React.findDOMNode(this.refs['play-button']),
         start_time = React.findDOMNode(this.refs.start);
     
     console.log(track_id);
     
     var stopWatch = {}

     if (this.state.playing === true) {
            this.state.sound.pause();
            play_button.className = "play-button"
            clearInterval(stopWatch.stopperStarter)
            console.log(this.state.time)

    } else  {

        stopWatch.stopperStarter = setInterval( ()=> {
                ++this.state.time 

                }, 1000)

        if(!this.state.sound) {

            play_button.className = "play-button show-pause";
            var track = `/tracks/${track_id}`;

               
             
                SC.stream(track, (soundObj) => {
                // soundObj.play();

                    this.setState({sound: soundObj, volume: 0.2});
                     
                     this.state.sound.play()      
             })

              } else {
                         this.state.sound.play();
                }
            }

        } 
    
    
    _replay(e) {
        console.log('replay clicked')
        var track_id = this.props.item.id
        if(this.state.sound){
            this.state.sound.stop()
        }
     
        SC.stream(`/tracks/${track_id}`, (soundObj) => {
                // soundObj.play();

                this.setState({sound: soundObj});
                 this.state.sound.play()

        });

    }
    _volumeUp(e) {
        console.log("up Clicked")
         var track_id = this.props.item.id
            if(this.state.sound){
            var v=this.state.volume;
            if(v <1) {
                    v += 0.2;
            this.state.sound.setVolume(v)
            this.setState({volume: v})
         }
     }
}
 _volumeDown(e) {
        console.log("down Clicked")
         var track_id = this.props.item.id
            if(this.state.sound){
            var v=this.state.volume;
            if(v > 0) 
            {
                    v -= 0.2;
            this.state.sound.setVolume(v)
            this.setState({volume: v})
         }
     }
}

    _mute(e) {
        console.log("mute clicked")
        var track_id = this.props.item.id

        if(this.state.sound) {
            var v;
            if(this.state.volume === 0){
                v =1
            } else {
                v = 0
            }

            this.state.sound.setVolume(v)
            this.setState({volume: v})
        }
    }

     render() {
        var url = this.props.item.get('permalink_url'),
            artwork_url = this.props.item.get('artwork_url'),
            title = this.props.item.get('title'),
            playCount = this.props.item.get('playback_count'),
            favCount = this.props.item.get('favoritings_count'),
            trackId = this.props.item.get('id'),
            duration = this.props.item.get('duration'),
            sL = 1000*Math.round(duration/1000),
             d= new Date(sL),
            img = artwork_url ? (<img src={artwork_url} />) : <img src="../images/random.jpg"/>;

        return ( 
            <div className="canvas"> 
                
        <div className="item"> 
                        <div className="play">
                            <div className="play-img">
                                {img}
                             <div className="play-button-container">
                                <div onClick={(e)=> this._streamAndStop(e)} className="play-button" ref="play-button"> </div>
                                     </div>
                            </div>
                    </div>
                     <div className="song-title">
                     <div refs="replay" className="replay" onClick={(e)=> this._replay(e)}>
                     <img src="../images/ic_replay_black_24dp.png"/> 
                     </div>

                      <div refs="Up" className="volumeUp" onClick={(e)=> this._volumeUp(e)}>
                        <img refs="Up" src="../images/ic_volume_up_black_24dp.png"/>
                        </div>

                        <div refs="Down"className="volumeDown" onClick={(e) => this._volumeDown(e)}>
                        <img refs="Down" src="../images/ic_volume_down_black_24dp.png"/>
                        </div>
                        
                        <div refs="mute" className="mute" onClick={(e)=> this._mute(e)}>
                        <img refs="mute" src="../images/ic_volume_off_black_24dp.png"/>
                        </div>

                        {title}
                       
                    </div> 
                 <div className ="play-time"> <div className="start-time" ref="start"/> <div className="duration"> { d.getUTCMinutes() + ':' + d.getUTCSeconds() } </div> <div className="track-bar"> <div className="track-circle" onMouseDown={(e)=> this._scrub(e)}> </div> </div> </div>
                <div className="icons">  
                <div className="icon-container">    
                     <div className="cloud"> </div>
                     </div>
                     <div className="icon-container"> 
                     <div className="buy"> <span> BUY </span> </div>
                     </div>
                     <div className="icon-container"> 
                     <div className= "play-number"> <span> {playCount} </span> </div>
                     </div>
                     <div className="icon-container"> 
                     <div className="likes"> <span> {favCount} </span> </div>
                     </div>
                 </div>
        </div>
        </div>
        )

    }