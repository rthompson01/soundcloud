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
        sound: null
     }

 }
   _streamAndStop(e) {
     console.log('play clicked')

     this.setState({playing: !this.state.playing})
     
     var play_button = React.findDOMNode(this.refs['play-button'])
     var track_id = this.props.item.id
     
     console.log(track_id)
     

     if (this.state.playing === true) {
            this.state.sound.pause()
    } else  {
        if(!this.state.sound)
            SC.stream(`/tracks/${track_id}`, (soundObj) => {
                // soundObj.play();

                this.setState({sound: soundObj});
                 this.state.sound.play()

            });
        
        else {
            this.state.sound.play()
        }
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
                         {img}
                     <div onClick={(e)=> this._streamAndStop(e)} className="play-button" ref="play-button"> </div>
                         </div>
                     <div className="song-title">
                     <img src="../images/ic_replay_black_24dp.png"/>
                      <div className="volumeUp">
                        <img src="../images/ic_volume_up_black_24dp.png"/>
                        </div>

                        <div className="volumeDown">
                        <img src="../images/ic_volume_down_black_24dp.png"/>
                        </div>
                        
                        <div className="mute">
                        <img src="../images/ic_volume_off_black_24dp.png"/>
                        </div>

                        {title}
                       
                    </div> 
                 <div className ="play-time"> 0:00 <div className="duration"> { d.getUTCMinutes() + ':' + d.getUTCSeconds() } </div> <div className="track-bar"> <div className="track-circle" onMouseDown={(e)=> this._scrub(e)}> </div> </div> </div>
                <div className="icons">      
                     <span className="cloud"> </span>
                     <span className="buy"> BUY </span>
                     <span className= "play-number">  {playCount} </span>
                     <span className="likes"> {favCount} </span>
                 </div>
        </div>
        </div>
        )

    }

}




class SoundcloudView extends React.Component {
    constructor(props) {
        super(props)
        this.props.items.on('sync', ()=> this.forceUpdate() )
    }

     _updateAndSearch(e) {
        // e.preventDefault()
        var input = React.findDOMNode(this.refs.search)
        var search_term = input.value
        // add letter to search bar value before refreshing results
        var jqueryInput = $("#srchBar")
        console.log(jqueryInput)
        console.log('here comes the input value')
        console.log(search_term)
        var existingText = jqueryInput.html()
        jqueryInput.html(existingText + search_term)
        // done adding
        collection.search_value = search_term;
        console.log('fetching searched data')
        collection.fetch().then((data)=>console.log(data))
        }
    render() {
        return ( 
            <div className="canvas">
            <div className="form">
            <form onKeyUp={(e)=> this._updateAndSearch(e)}>
                    <button> Search </button>
                    <input className="search" type="text" id="srchBar" ref='search' placeholder="Search"/>
                    
                </form>
                </div>
                    <ul> 
                        {this.props.items.map((i)=> <SoundcloudItem key={i.id} item={i} />)}
                    </ul>
            </div>
        )
    }
}

var collection = new SoundcloudCollection
collection.search_value = 'beatles'

React.render( <SoundcloudView title="SoundCloud" items={collection} /> , qs('.container'))
collection.fetch().then((data) => { 
        console.log(data); })


 //
 //        
 //        <div class ="play-time"> </div>
 //        <div class="icons"> 
 //        <span class="cloud"> <i class="large mdi-editor-insert-chart"> </i> </span>
 //        <span class="buy"> </span>
 //        <span class-"play-number"> </span>
 //        <span class="likes"> </span>
 //        </div>


 //        </div>
 //    </div>