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
// 
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
    url: () => `https://api.soundcloud.com/tracks.json?client_id=${key}`
})



class SoundcloudItem extends React.Component {
        constructor(props) {
            super(props)
        }
        render() {
        var url = this.props.item.get('permalink_url'),
            artwork_url = this.props.item.get('artwork_url'),
            title = this.props.item.get('title'),
            playCount = this.props.item.get('playback_count'),
            favCount = this.props.item.get('favoritings_count'),
            img = artwork_url ? (<img src={artwork_url} />) : '';

        return (
        <div className="item"> 
                    <div className="play">
                         {img}
                     <div className="play-button"> </div>
                         </div>
                     <div className="song-title">
                        {title}
                    </div> 
                 <div className ="play-time"> </div>
                <div className="icons">      
                     <span className="cloud"> </span>
                     <span className="buy"> BUY </span>
                     <span className= "play-number">  {playCount} </span>
                     <span className="likes"> {playCount} </span>
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
    render() {
        return ( 
            <div>
                    <ul> 
                        {this.props.items.map((i)=> <SoundcloudItem key={i.id} item={i} />)}
                    </ul>
            </div>
        )
    }
}

var collection = new SoundcloudCollection();
React.render( <SoundcloudView title="SoundCloud" items={collection} /> , qs('.container'))
collection.fetch().then((data) => { 
        console.log(data); })