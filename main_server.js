require('dotenv').config();
const puppeteer = require('puppeteer');
const fbCore = require('fb-downloader-scrapper');
const {twitter,ttdl, fbdown, youtube } = require('imran-downloader-servar');
const igCore = require('instagram-url-direct');
const http = require('http');
const express = require('express');
const websocket = require('ws');
const path = require('path');
const app = express()
const server = http.createServer(app);
const wss = new websocket.Server({server});
const ytdl = require('ytdl-core');
const body = require('body-parser');
const urlencoded = body.urlencoded({extended:false});
const fs = require('fs');
const axios = require('axios');
const checkPlatform = {
    'youtube':(url) =>{
        const reg = /(youtube.com)|(youtu.be)/;
        return reg.test(url)
    },
    'snapchat':(url) =>{
        const reg = /snapchat.com/
        return reg.test(url)
    },
    'facebook':(url) =>{
        const reg = /(fb.watch)|(facebook.com)/
        return reg.test(url)
    },
    'twitter':(url) =>{
        const reg = /(twitter.com)|(x.com)/
        return reg.test(url)
    },
    'tiktok':(url) =>{
        const reg = /tiktok.com/
        return reg.test(url)
    },
    'instagram':(url) =>{
        const reg = /instagram.com/
        return reg.test(url)
    }
}

app.use(express.static(path.join(__dirname,'./static')))
app.use(express.static(__dirname))
app.set('view engine', 'ejs');

app.get('/',(req,res) =>{
    res.render(path.join(__dirname,'./static/index.ejs'),{mode:req.query.mode === undefined ? 'all' : req.query.mode});
})

app.get('/sitemap.xml', (req,res) =>{
    res.sendFile(path.join(__dirname,'./static/sitemap.xml'))
})

app.get('/privacy-policy', (req,res) =>{
    res.sendFile(path.join(__dirname,'./static/privacy.html'));
})

app.get('/sitemap.xml', (req,res) =>{
    res.sendFile(__dirname, '/sitemap.xml')
})

app.get('/downloadVideo',urlencoded,(req,res) =>{
    let dataStream;
    const reqData = req.query;
    let fileName;
    console.log(reqData)
    switch(reqData.format)
    {
        case 'videoonly':
            fileName = 'video.mp4'
            dataStream = ytdl(reqData.url, { filter: format => format.hasVideo && !format.hasAudio && format.qualityLabel === reqData.resolution});
        break;
        case 'audioonly':
            fileName = 'audio.mp3'
            dataStream = ytdl(reqData.url, { filter: format => !format.hasVideo && format.hasAudio});
        break;
        case 'videoaudio':
            fileName = 'video.mp4'
            dataStream = ytdl(reqData.url, { filter: format => format.hasVideo && format.hasAudio && format.qualityLabel === reqData.resolution});
    }

    try{
        console.log(fileName)
        res.header('Content-Type', 'video/mp4');
        res.header(`Content-Disposition', 'attachment; filename="${fileName}"`);
        // console.log(dataStream.pipe(res))
        dataStream.pipe(fs.createWriteStream('new_test.mp4'));
        // console.log(Object.keys(dataStream))
    }
    catch(err)
    {
        console.log(err)
    }
    console.log('recieved request')
})

app.get('/downloadData',(req,res) =>{

    try{
        const reqData = req.query

        console.log(reqData.format, reqData.url)
    
        async function streamData(src,format,res)
        {
            // const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,defaultViewport:false});
            // const page = await browser.newPage();
        
            // Stream the video data directly to the client's browser
    
                    res.setHeader('Content-Type', `video/${format === 'video' ? 'mp4' : 'mp3'}`);
                    res.setHeader('Content-Disposition', `attachment; filename="snapchat-video.${format === 'video' ? 'mp4' : 'mp3'}"`);
                
                    const videoResponse = await axios.get(src, { responseType: 'arraybuffer' })
    
    
                    // console.log(src,format)
                    res.send(videoResponse.data)
    
            // console.log(vidData)
    
            // await browser.close();
        }
    
        streamData(reqData.url,reqData.format,res)
    }
    catch(err)
    {
        console.log(err);
    }
})

server.listen(process.env.PORT,() =>{
    console.log(`port is listening at ${process.env.PORT}`)
})

const checkUrlType = (data,ws) =>{
    let type;
    console.log(data.mode)
    for(let i = 0; i < Object.keys(checkPlatform).length; i++)
    {
        if (checkPlatform[`${Object.keys(checkPlatform)[i]}`](data.msg))
        {
            if(data.mode === Object.keys(checkPlatform)[i])
            {
                type = Object.keys(checkPlatform)[i];  
            }
            else if(data.mode === 'all')
            {
                type = Object.keys(checkPlatform)[i];
            }
            break;
        }
    }

    switch(type)
    {
        case 'youtube':
            // processYoutubeInfo(data,ws)
            youtube_def(data,ws)
        break;
        case 'snapchat':
            processSnapChatInfo(data,ws)
        break;
        case 'facebook':
            processFb(data,ws)
        break;
        case 'twitter':
            processTwitter(data,ws)
        break;
        case 'tiktok':
            processTikTok(data,ws)
        break
        case 'instagram':
            processInstagram(data,ws)
        break;
        default:
            ws.send(JSON.stringify({
                post:'validate',
                status:false,
                errorMsg:'App doesn\'t support this URL'
            }))
    }
}

wss.on('connection',ws =>{
    ws.on('message', data =>{
        let parsed
        try{
            parsed = JSON.parse(data)
            checkUrlType(parsed,ws)
        }
        catch(err)
        {
            console.log(err)
        }
    })
})

async function processYoutubeInfo(data,ws)
{
    switch(true)
    {
        case data.post === 'validate':
            const result = await ytdl.validateURL(data.msg);
            switch(true)
            {
                case result === true:
                    const videoInfo = await ytdl.getInfo(data.msg);
                    const resolutions = {
                        va:[],
                        v:[],
                        vSize:[],
                        vaSize:[]
                    }
                    videoInfo.formats.map(format =>{
                        switch(true)
                        {
                            case format.hasVideo && format.hasAudio:
                                switch(true)
                                {
                                    case !resolutions['va'].includes(format.qualityLabel):
                                        resolutions['va'].push(format.qualityLabel)
                                        resolutions['vaSize'].push(format.contentLength !== undefined ? `${(format.contentLength/1000000).toFixed(2)}mb` : 'Null')
                                }
                            break;
                            case format.hasVideo && !format.hasAudio:
                                switch(true)
                                {
                                    case !resolutions['v'].includes(format.qualityLabel):
                                        resolutions['v'].push(format.qualityLabel);
                                        resolutions['vSize'].push(format.contentLength !== undefined ? `${(format.contentLength/1000000).toFixed(2)}mb` : 'Null')
                                }
                            break;
                        }
                    })

                    // resolutions['va'] = Array.from(new Set(resolutions['va']))
                    // resolutions['v'] = Array.from(new Set(resolutions['v']))

                    console.log(resolutions)

                    ws.send(JSON.stringify({
                        post:'validate',
                        status:true,
                        urlType:'youtube',
                        resolution:resolutions,
                        videoTitle:videoInfo.videoDetails.title
                    }))
                break;
                default:
                    ws.send(JSON.stringify({
                        post:'validate',
                        status:false,
                        errorMsg:'sorry, but this video is not available for download'
                    }))
            }
    }
}

async function processSnapChatInfo(data,ws)
{

    getSnapChatVideoLink(data.msg)
    .then(src =>{
        ws.send(JSON.stringify({
            post:'validate',
            status:src !== undefined ? true : false,
            urlType:'snapchat',
            downloadLink:src,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
    .catch(err =>{
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}

async function getSnapChatVideoLink(url)//executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
{
    const browser = await puppeteer.launch({headless:true,defaultViewport:false});
    //C:\Program Files\Google\Chrome\Application\chrome.exe
    const page = await browser.newPage();
    await page.goto(url);

    const src = await page.$eval('video', video => video.src)
    .catch(err =>{
        console.log('an error occured here')
    })
    // const page2 = await browser.newPage()
    // await page2.goto('https://chatgpt.com/?oai-dm=1')

    await browser.close();

    return src;
}

async function youtube_def(data,ws)
{
    youtube(data.msg)
    .then((result) =>{
        const video = result.mp4;
        const audio = result.mp3;

        ws.send(JSON.stringify({
            post:'validate',
            status:video !== undefined ? true : false,
            urlType:'youtube',
            downloadLink:video,
            audSrc:audio,
            videoTitle:result.id === null ? 'yout-file' : result.id
        }))

    })
    .catch(err =>{
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}

async function processFb(data,ws)
{
    fbdown(data.msg)
    .then((result)=>{
            ws.send(JSON.stringify({
                post:'validate',
                status:result.Normal_video !== undefined ? true : false,
                urlType:'facebook',
                downloadLink:result.Normal_video,
                videoTitle:result.title === undefined ? 'fb-file' : result.title
            }))
    }).catch((err)=>{
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}

async function processTwitter(data,ws)
{
    const url = data.msg
    await twitter(url)
    .then(retData =>{
        const dataArray = retData.url;
        const refinedDataUrl = {};
        for(let i = 0; i < dataArray.length; i++)
        {
            refinedDataUrl[`${Object.keys(dataArray[i])[0]}`] = dataArray[i][`${Object.keys(dataArray[i])[0]}`]
        }

        let src = refinedDataUrl.sd === undefined ? refinedDataUrl.hd : refinedDataUrl.sd;

        ws.send(JSON.stringify({
            post:'validate',
            status:src !== undefined ? true : false,
            urlType:'twitter',
            downloadLink:src,
            videoTitle:retData.title === undefined ? 'file' : retData.title
        }))
    })
    .catch(err =>{
        console.log('an error occured')
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}

async function processTikTok(data,ws)
{
    const url = data.msg
    await ttdl(url)
    .then(retData =>{
        let src = retData.video[0];
        let audioSrc = retData.audio[0];

        ws.send(JSON.stringify({
            post:'validate',
            status:src !== undefined ? true : false,
            urlType:'tiktok',
            downloadLink:src,
            audSrc:audioSrc,
            videoTitle:retData.title === undefined ? 'file' : retData.title
        }))
    })
    .catch(err =>{
        console.log('an error occured');
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}

async function processInstagram(data,ws)
{
    await igCore(data.msg)
    .then(refData =>{
            const src = refData.url_list[0]

            ws.send(JSON.stringify({
                post:'validate',
                status:src !== undefined ? true : false,
                urlType:'instagram',
                downloadLink:src,
                videoTitle:'Inst-video -- Title Unavailable'
            }))

    })
    .catch(err =>{
        console.log('an error occured');
        console.log(err)
        ws.send(JSON.stringify({
            post:'validate',
            status:false,
            errorMsg:'sorry, but this video is not available for download'
        }))
    })
}
