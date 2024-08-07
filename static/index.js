import {
    createElement,
    getState,
    preState,
    mount,
    virtualDom,
    styleComponent,
    setStyle,
    sydDOM,
    useState
} from '../sydneyDom.js'
import "./navbar.js"

let processing = false;
let socketConnection = false;

const ws = new WebSocket('http://localhost:8080/');

let downloadObject = {
    url:'',
    format:'',
    resolution:'',
    audioUrl:'',
    urlType:'',
    videoUrl:''
}

const youtubeStates = {
    resSize:0
}

const updateDState = (size = '250px') =>
{
    const displayContent = getState('displayContent');
    displayContent.h = size
    useState('displayContent',{type:'a',value:displayContent})
}

ws.addEventListener('open',() =>{
    socketConnection = true;
    console.log('we are connected')

    ws.addEventListener('message',({data}) =>{
        processing = false;
        updateDState()
        const parsed = JSON.parse(data);
        const downloadSite = getState('downloadSite');
        const renderFailed = getState('renderFailed');
        const othersDownload = getState('othersDownload')

        console.log(parsed)
        
        switch(true)
        {
            case parsed.post === 'validate':
                const moveLoader = getState('moveLoader');
                moveLoader.d = 'none';
                useState('moveLoader',{type:"a",value:moveLoader})
                switch(true)
                {
                    case !parsed.status:
                        renderFailed.d = 'flex';
                        renderFailed.msg = parsed.errorMsg === undefined ? 'video not available for download' : parsed.errorMsg;
                        downloadSite.d = 'none'
                        useState('renderFailed',{type:'a',value:renderFailed})
                        useState('downloadSite',{type:'a',value:downloadSite})
                        console.log('sorry, but this app doesn\'t support this type of URL')
                    break;
                    default:
                        switch(true)
                        {
                            // case parsed.urlType === 'youtube':
                            //     downloadObject.urlType = parsed.urlType
                            //     const resolution = getState('resolution');
                            //     resolution.fetched = parsed.resolution
                            //     renderFailed.d = 'none';
                            //     downloadSite.d = 'flex';
                            //     othersDownload.d = 'none'

                            //     //set file title
                            //     const titleDownloadYoutubeSection = getState('titleDownload')
                            //     titleDownloadYoutubeSection.text = parsed.videoTitle
                            //     useState('titleDownload',{type:'a',value:titleDownloadYoutubeSection})
                            //     //end set file title


                            //     useState('renderFailed',{type:'a',value:renderFailed})
                            //     useState('downloadSite',{type:'a',value:downloadSite})
                            //     useState('othersDownload',{type:'a',value:othersDownload})
                            //     useState('resolution',{type:'a',value:resolution});

                            // break;
                            default:
                                
                                othersDownload.mode = parsed.urlType;
                                downloadObject.urlType = parsed.urlType

                                //set file title
                                const titleDownload = getState('titleDownload')
                                titleDownload.text = parsed.videoTitle
                                useState('titleDownload',{type:'a',value:titleDownload});
                                downloadObject.audioUrl = parsed.audSrc;
                                //end set file title
                            

                                renderFailed.d = 'none';
                                downloadSite.d = 'none';
                                othersDownload.d = 'flex'

                                useState('renderFailed',{type:'a',value:renderFailed})
                                useState('downloadSite',{type:'a',value:downloadSite})
                                useState('othersDownload',{type:'a',value:othersDownload})

                                downloadObject.url = parsed.downloadLink
                                downloadObject.videoUrl = parsed.downloadLink;
                                //update the mode when coming here
                        }
                }
        }
    })
})

ws.addEventListener('close',() =>{
    socketConnection = false
})

setStyle([
    {
        nameTag:'container',
        style:{
            height:'fit-content',
            minHeight:'100vh',
            // width:'100vw',
            color:'#fff',
            fontFamily:'ubuntu',
            backgroundColor:'rgba(0,0,0,.2)',
            display:'flex',
            flexDirection:'column',
            rowGap:'50px',
            alignItems:'center',
            // padding:'0 10px',
            paddingTop:'100px',
            paddingBottom:'30px',
            overflowX:'hidden',
            position:'relative'
        }
    },
    {
        nameTag:'nav',
        style:{
            // position:'fixed',
            top:'0',
            left:'0',
            height:'fit-content',
            width:'100%',
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            padding:'10px 20px'
        }
    },
    {
        nameTag:'bg',
        style:{
            backgroundPosition:'center',
            backgroundSize:'contain',
            backgroundRepeat:'no-repeat'
        }
    },
    {
        nameTag:'shadow',
        style:{
            boxShadow:'1px 1px 5px #171717'
        }
    }
])

sydDOM.container = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.container()+styleComponent.bg({method:'add',style:{backgroundSize:'cover',backgroundPosition:'50% 0'}})
        },
        [
            // sydDOM.navBar(),
            sydDOM.navBar_2(),
            sydDOM.mainPage(),
            sydDOM.howItWork(),
            sydDOM.videoQualitySec(),
            sydDOM.decForm(),
            sydDOM.qualitativeDetails()
        ]
    )
}

sydDOM.navBar = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.nav()
        },
        [
            sydDOM.title(),
            // sydDOM.navBtnTab()
        ]
    )
}

sydDOM.title = () =>{
    return createElement(
        'p',
        {
            style:'font-size:16px;font-weight:700;text-transform:capitalize;min-width:50px;height:50px;background-image:url("./assets/logo.jpg");z-index:999;'+styleComponent.bg()
        },
        [
        ]
    )
}

sydDOM.navBtnTab = () =>{
    return createElement(
        'div',
        {
            style:'width:100%;justify-content:space-between;max-width:500px',
            id:'navMiniTab'
        },
        [
            sydDOM.button('home',''),
            sydDOM.button('community',''),
            sydDOM.button('price',''),
            sydDOM.button('contact',''),
        ]
    )
}

sydDOM.button = (text,url) =>{
    return createElement(
        'div',
        {
            style:'padding:5px 10px;border-radius:10px;border:1px solid #fff;text-transform:capitalize'
        },
        [
            text
        ]
    )
}

sydDOM.mainPage = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;display:flex;flex-direction:column;row-gap:20px;padding-left:40px;padding-right:10px;max-width:600px;align-self:flex-start;'
        },
        [
            createElement(
                'h1',
                {style:'text-transform:capitalize;font-weight:500;font-size:25px'},
                [
                    mode === 'all' ? "all social media downloader" : `${mode} downloader`
                ]
            ),
            createElement(
                'p',
                {
                    style:''
                },
                [
                    'Your one-stop destination for effortlessly downloading videos from various social media platforms!'
                ]
            ),
            createElement(
                'p',
                {
                    style:'font-weight:300;font-size:16px'
                },
                [
                    `In this digital age, social media is an integral part of our lives, offering a plethora of captivating videos that entertain, educate, and inspire. Whether it's a funny clip, a tutorial, a memorable moment, or an insightful interview, these videos often leave a lasting impact. However, the challenge arises when you want to save these videos for offline viewing or sharing with friends and family.`
                ]
            ),
            createElement(
                'p',
                {
                    style:'font-weight:300;font-size:16px'
                },
                [
                    `No more endless searching for third-party applications or dealing with complex processes. We've simplified the entire downloading process so that you can focus on enjoying and sharing the content that matters most to you.`
                ]
            ),
            sydDOM.enterUrl(),
            sydDOM.displayContent()
        ]
    )
}

sydDOM.howItWork = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:fit-content;padding:10px 20px;background:#fff;width:100%;border-radius:20px;color:grey;display:flex;flex-direction:column;row-gap:15px;justify-content:center;align-items:center;max-width:800px;'+styleComponent.shadow()
        },
        [
            createElement(
                'p',
                {
                    style:'text-transform:capitalize;align-self:flex-start;font-size:18px'
                },
                [
                    'see how it works'
                ]
            ),
            createElement(
                'div',
                {
                    style:'height:fit-content;width:100%;display:flex;column-gap:15px;row-gap:15px;',
                    id:'infoTabParent'
                },
                [
                    sydDOM.infoTabs({
                        num:'01',
                        text:'Click the paste button to paste video url or manually enter url in text section'
                    }),
                    sydDOM.infoTabs({
                        num:'02',
                        text:'Once video has been processed, a tab will be opened below the input section'
                    }),
                    sydDOM.infoTabs({
                        num:'03',
                        text:'Select any resolution of download format of your choice to download'
                    }),
                ]
            )
        ]
    )
}

sydDOM.infoTabs = ({text = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae nesciunt repudiandae doloremque incidunt non voluptas',num}) =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;min-height:120px;width:100%;min-width:150px;background:#fbeaf1;border-radius:20px;display:flex;row-gap:10px;display:flex;padding:10px;column-gap:10px'
        },
        [
            sydDOM.left(num),
            sydDOM.msgTab(text)
        ]
    )
}

sydDOM.left = (num) =>{
    return createElement(
        'div',
        {
            style:'height:100%;width:30px;min-width:30px;display:flex;flex-direction:column;align-items:center;row-gap:20px;'
        },
        [
            createElement('div',{style:'height:30px;width:30px;background-image:url(./assets/check.png);border-radius:50%;'+styleComponent.bg()}),
            createElement('h2',{style:'font-weight:500;text-transform:capitalize;color:#333'},[`${num}`])
        ]
    )
}

sydDOM.msgTab = (text) =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;display:flex;row-gap:10px;flex-direction:column'
        },
        [
            createElement('p',{style:'font-weight:800;color:#171717;'},['Paste in video url']),
            createElement('p',{style:'color:#333;font-size:16px'},[`${text}`]),
        ]
    )
}

sydDOM.enterUrl = () =>{
    paste = async () =>{
        const board = await navigator.clipboard.readText()

        virtualDom['urlTagInput'].focus()
        virtualDom['urlTagInput'].value = `${board}`
        sendUrl(virtualDom['urlTagInput'])
    }
    return createElement(
        'div',
        {
            style:'display:flex;align-items:center;column-gap:10px;background:rgba(255,255,255,.4);padding:5px;height:fit-content;min-height:40px;width:100%;border-radius:5px;padding-bottom:12px;position:relative;'+styleComponent.shadow()
        },
        [
            sydDOM.inputUrlBox(),
            createElement(
                'div',
                {
                    style:'height:30px;min-width:30px;width:30px;min-height:30px;background-image:url("./assets/paste.png");border-radius:inherit;'+styleComponent.bg(),
                    class:'click',
                    onclick:'paste()'
                }   
            ),
            sydDOM.moveLoader()
        ]
    )
}

sydDOM.inputUrlBox = () =>{
    sendUrl = (elem) =>{
        switch(true)
        {
            case socketConnection:
                switch(true)
                {
                    case !processing:
                        const resolution = getState('resolution');
                        resolution.data = [];
                        useState('resolution',{type:'a',value:resolution})
                        ws.send(JSON.stringify({
                            post:'validate',
                            msg:elem.value,
                            mode:mode
                        }));
                        downloadObject = {
                            url:elem.value,
                            format:'',
                            resolution:'',
                            audioUrl:'',
                            urlType:''
                        }
                        processing = true
                        updateDState('0px');

                        const moveLoader = getState('moveLoader');
                        moveLoader.d = 'block';
                        useState('moveLoader',{type:"a",value:moveLoader})
                    break
                }
            break;
            default:
                alert('you are disconnected, page will be reloaded')
                location.reload()
        }   
    }
    return createElement(
        'input',
        {
            style:'height:40px;width:100%;border:none;background:#fff;padding:5px 15px;outline:none;border-radius:inherit',
            placeholder:mode === 'all' ? "Paste any social media url" : `Paste a ${mode.toUpperCase()} url`,
            oninput:'sendUrl(this)'
        },
        [],
        {type:'urlTagInput'}
    )
}

sydDOM.moveLoader = () =>{
    return createElement(
        'div',
        {
            style:`height:8px;width:100%;overflow:hidden;position:absolute;bottom:0;left:0;display:${preState(['moveLoader','d'],'none')}`
        },
        [
            createElement(
                'div',
                {
                    style:'height:4px;width:30%;background:#5a338b;position:absolute;',
                    class:'loadingRes'
                }
            )
        ],
        {
            createState:{
                stateName:'moveLoader',
                state:{d:'none'}
            },
            type:'moveLoader'
        }
    )
}

sydDOM.displayContent = () =>{
    return createElement(
        'div',
        {
            style:`height:fit-content;min-height:${preState(['displayContent','h'],'0px')};opacity:${preState(['displayContent','h'],'0px') === '0px' ? '0' : '1'};width:100%;background:#333;box-shadow:2px 2px 5px 0.5px #171717 inset;border-radius:15px;font-family:monospace;overflow:scroll;transition:opacity .2s linear;`//250px
        },
        [
            sydDOM.renderFailed(),
            sydDOM.downloadSite(),
            sydDOM.othersDownload(),
            sydDOM.loader(),
        ],
        {
            createState:{
                stateName:'displayContent',
                state:{h:'0px'}
            },
            type:'displayContent'
        }
    )
}

sydDOM.loader = () =>{
    return createElement(
        'div',
        {
            style:`height:fit-content;width:250px;position:relative;background:2a2a2ab1;display:${preState(['loader','d'],'none')};flex-direction:column;row-gap:5px;padding:10px;font-size:13px;margin-left:20px`
        },
        [
            createElement(
                'div',
                {
                    style:'height:5px;width:100%;position:relative;background:#141414;'
                },
                [
                    createElement(
                        'div',
                        {
                            style:`height:5px;width:${preState(['loader','cw'],'0')}%;background:green;border-top-right-radius:2px;border-bottom-right-radius:2px;transition:all 0s linear`
                        }
                    )
                ]
            ),
            `Downloading ${preState(['loader','remain'],'0.00')}mb of ${preState(['loader','fullSize'],'0.00')}mb`
        ],
        {
            createState:{
                stateName:'loader',
                state:{d:'none',cw:'0',remain:'0.00',fullSize:'0.00'}
            },
            type:'loader'
        }
    )
}

sydDOM.othersDownload = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;row-gap:10px;display:${preState(['othersDownload','d'],'none')};flex-direction:column;justify-content:flex-start;align-items:flex-start;text-transform:capitalize;padding:10px 5px 10px 20px;`
        },
        [
            sydDOM.titleDownload(),
            createElement(
                'div',
                {
                    style:styleComponent.clickableSection() + `display:flex;`
                },
                [
                    'Download Type',
                    sydDOM.clickableModel(preState(['othersDownload','mode'],'snapChat') + ' video','otherDL'),
                    sydDOM.clickableModel(preState(['othersDownload','mode'],'snapChat') + ' audio','otherDL')
                ]
            ),
            sydDOM.othersDbtn()
        ],
        {
            createState:{
                stateName:'othersDownload',
                state:{d:'none',mode:'snapChat'}
            },
            type:'othersDownload'
        }
    )
}

sydDOM.renderFailed = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;display:${preState(['renderFailed','d'],'none')};justify-content:center;align-items:center;text-transform:capitalize;color:#ef361a`
        },
        [
            preState(['renderFailed','msg'],'')
        ],
        {
            createState:{
                stateName:'renderFailed',
                state:{msg:'',d:'none'}
            },
            type:'renderFailed'
        }
    )
}
setStyle([
    {
        nameTag:'clickableSection',
        style:{
            padding:'5px',
            width:'fit-content',
            height:'fit-content',
            display:'flex',
            columnGap:'20px',
            rowGap:'5px',
            alignItems:'center'
        }
    }
])

sydDOM.downloadSite = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:100%;row-gap:10px;display:${preState(['downloadSite','d'],'none')};flex-direction:column;justify-content:flex-start;align-items:flex-start;text-transform:capitalize;padding:10px 5px 10px 20px;`
        },
        [
            // sydDOM.clickableModel(),
            sydDOM.titleDownload(),
            createElement(
                'div',
                {
                    style:styleComponent.clickableSection()
                },
                [
                    'Download Type',
                    sydDOM.clickableModel('video'),
                    sydDOM.clickableModel('audio')
                ]
            ),
            createElement(
                'div',
                {
                    style:styleComponent.clickableSection() + `display:${preState(['downloadSite','one'],'none')};`
                },
                [
                    'video (MP4)',
                    sydDOM.clickableModel('video only'),
                    sydDOM.clickableModel('video & audio')
                ]
            ),
            sydDOM.resolution(),
            sydDOM.downloadButton()
        ],
        {
            createState:{
                stateName:'downloadSite',
                state:{one:'none',two:'none',d:'none'}
            },
            type:'downloadSite'
        }
    )
}

sydDOM.titleDownload = () =>{
    return createElement(
        'p',
        {
            style:'text-transform:capitalize;font-size:14px;color:#fff;padding:5px'
        },
        [
            "Title: ",preState(['titleDownload','text'],'hey')
        ],
        {
            createState:{
                stateName:'titleDownload',
                state:{text:'hey'}
            },
            type:'titleDownload'
        }
    )
}

sydDOM.resolution = () =>{
    const getContents = () =>{
        const content = preState(['resolution','data'],[]);
        const sizes = preState(['resolution','sizes'],[])
        const doc = [];
        content.forEach((val,id) =>{
            doc.push(sydDOM.clickableModelRes(val,`${id}`,sizes[id]))
        })
        return doc
    }

    return createElement(
        'div',
        {
            style:styleComponent.clickableSection({method:'add',style:{flexWrap:'wrap'}}) + `display:${preState(['downloadSite','two'],'none')};`
        },
        [
            'Resolutions',
            ...getContents()
        ],
        {
            createState:{
                stateName:'resolution',
                state:{data:[],current:'-1'}
            },
            type:'resolution'
        }
    )
}

sydDOM.decForm = () =>{
    return createElement(
        'form',
        {
            style:'position:absolute;top:-200px;opacity:0',
            method:'POST',
            action:'/downloadVideo'
        },
        [
            createElement('input',{name:'url'},[],{type:'input$url'}),
            createElement('input',{name:'format'},[],{type:'input$format'}),
            createElement('input',{name:'resolution'},[],{type:'input$res'}),
        ],
        {
            type:'decForm'
        }
    )
}

sydDOM.downloadButton = () =>{
    downloadVideo = () =>{
        let empty = false
        for(let i = 0; i < Object.keys(downloadObject).length; i++)
        {
            switch(true)
            {
                case Object.keys(downloadObject)[i] !== 'audioUrl':
                    if(downloadObject[`${Object.keys(downloadObject)[i]}`].length === 0)
                    {
                        empty = true;
                        break
                    }
            }
        }

        switch(true)
        {
            case !empty || downloadObject.format === 'audio only':
                async function send()
                {
                    console.log('ready to send')

                    //display download tab
                    const loader = getState('loader');
                    loader.d = 'flex';
                    useState('loader',{type:'a',value:loader})
                    //display download tab

                    const response = await fetch(`/downloadVideo?url=${encodeURIComponent(downloadObject.url)}&format=${downloadObject.format.split(' ').join('')}&resolution=${downloadObject.resolution.split(' ').join('')}`);

                    console.log(response, ' this is the response')

                    //get resolution sizes
                    const resolution = getState('resolution');
                    const totalData = resolution.current === '-1' ? '?' : (resolution.sizes[resolution.current] !== 'Null' ? Number(resolution.sizes[resolution.current].replace('mb','')) : '?');

                    //update fullSize
                    const loaderUpdate2 = getState('loader');
                    loaderUpdate2.fullSize = `${totalData}`;
                    useState('loader',{type:'a',value:loaderUpdate2})
                    //update fullSize

                    const reader = response.body.getReader();
                    let loadedByte = 0;
                    let chunks = []

                    function read()
                    {
                        reader.read()
                        .then(({done,value}) =>{
                            if(done)
                            {
                                console.log('we are done')

                                //remove download tab
                                const timer = setTimeout(() => {
                                    const loader = getState('loader');
                                    loader.d = 'none';
                                    loader.cw = '0'
                                    loader.fullSize = '0.00'
                                    loader.remain = '0.00'
                                    useState('loader',{type:'a',value:loader})
                                }, 2000);
                                //remove download tab

                                async function startDownload ()
                                {
                                    const blob = new Blob(chunks);
                                    const url = window.URL.createObjectURL(blob)
                
                                    const a = document.createElement('a');
                                    a.href = url;
                                    switch(true)
                                    {
                                        case downloadObject.format === 'audio':
                                            a.download = `${downloadObject.urlType}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}.mp3`;
                                        break;
                                        default:
                                            a.download = `${downloadObject.urlType}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}.mp4`;
                                    }
                
                                    console.log('am here')
                                    document.body.appendChild(a);
                                    a.click();
                                }

                                startDownload()
                            }
                            else{
                                loadedByte += value.byteLength;
                                // console.log(loadedByte, totalData)

                                const loader = getState('loader');
                                // console.log((loadedByte/totalData)*100)
                                loader.cw = `${(loadedByte/((totalData === '?' ? 2000000 : totalData) *1000000))*100}`;
                                console.log(loader.cw)
                                loader.remain = `${(loadedByte/1000000).toFixed(2)}`
                                useState('loader',{type:'a',value:loader})

                                chunks.push(value);
                                console.log(chunks)
                                read()
                            }
                        })
                    }
                    read()
                    //youtube https://www.instagram.com/reel/CxIqtD6o0p9/?utm_source=ig_web_copy_link

                }
                send()
                //fetch request
        }
    }
    return createElement(
        'div',
        {
            style:'padding:10px 15px;background:green;color:#fff;border-radius:10px;margin-top:30px',
            class:'click',
            onclick:'downloadVideo()'
        },
        [
            'Download youtube'
        ]
    )
}

sydDOM.othersDbtn = () =>{
    downloadOthersData = () =>{
        switch(true)
        {
            case downloadObject.url.length > 0 && downloadObject.format.length > 0:
                console.log(downloadObject.url, downloadObject.format)

                async function send()
                {

                    //display download tab
                    const loader = getState('loader');
                    loader.d = 'flex';
                    useState('loader',{type:'a',value:loader})
                    //display download tab

                    console.log('clicked the other part')

                    const response = await fetch(`/downloadData?url=${encodeURIComponent(downloadObject.url)}&format=${downloadObject.format}&urlType=${preState(['othersDownload','mode'],'snapChat')}`)

                    const totalData = response.headers.get('content-length')

                    //update fullSize
                    const loaderUpdate2 = getState('loader');
                    loaderUpdate2.fullSize = `${(totalData/1000000).toFixed(2)}`;
                    useState('loader',{type:'a',value:loaderUpdate2})
                    //update fullSize

                    const reader = response.body.getReader();
                    let loadedByte = 0;
                    let chunks = [];

                    function read()
                    {
                        reader.read()
                        .then(({done,value}) =>{
                            if(done)
                            {
                                console.log('we are done')

                               //remove download tab
                                const timer0 = setTimeout(() => {
                                    const loader = getState('loader');
                                    loader.d = 'none';
                                    loader.cw = '0'
                                    loader.fullSize = '0.00'
                                    loader.remain = '0.00'
                                    useState('loader',{type:'a',value:loader})
                                    clearTimeout(timer0)
                                }, 2000);
                                //remove download tab   

                                async function startDownload ()
                                {
                                    const blob = new Blob(chunks);
                                    const url = window.URL.createObjectURL(blob)
                
                                    const a = document.createElement('a');
                                    a.href = url;
                                    switch(true)
                                    {
                                        case downloadObject.format === 'audio':
                                            a.download = `${downloadObject.urlType}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}.mp3`;
                                        break;
                                        default:
                                            a.download = `${downloadObject.urlType}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}${Math.round(Math.random()*9)}.mp4`;
                                    }
                
                                    console.log('am here')
                                    document.body.appendChild(a);
                                    a.click();
                                }

                                startDownload()
                            }
                            else{
                                loadedByte += value.byteLength;
                                
                                const loader = getState('loader');
                                // console.log((loadedByte/totalData)*100)
                                loader.cw = `${(loadedByte/totalData)*100}`;
                                loader.remain = `${(loadedByte/1000000).toFixed(2)}`
                                useState('loader',{type:'a',value:loader})

                                chunks.push(value);
                                read()
                            }
                        })
                    }
                    read()
                }
                const blobReg = /^(https:)/
                switch(true)
                {
                    case !blobReg.test(downloadObject.url):
                        console.log('this url cant be downloaded')
                        alert('this file cant be downloaded')
                    break;
                    default:
                        send()
                }
        }
    }
    return createElement(
        'div',
        {
            style:'padding:10px 15px;background:green;color:#fff;border-radius:10px;margin-top:30px',
            class:'click',
            onclick:'downloadOthersData()'
        },
        [
            'Download'
        ]
    )
}

sydDOM.clickableModel = (text = 'model',type = 'norm') =>{
    return createElement(
        'div',
        {
            style:'height:30px;width:fit-content;padding:0 5px;display:flex;column-gap:10px;justify-content:center;align-items:center;background:#2a2a2ab1;border-radius:10px;text-transform:capitalize;cursor:pointer',
            onclick:`clickableMod('${text}','${type}',this)`
        },
        [
            createElement(
                'div',
                {
                    style:`min-height:18px;min-width:18px;background:#171717;border-radius:50%;display:flex;justify-content:center;align-items:center;`
                },
                [
                    createElement('div',{style:`min-height:10px;min-width:10px;background:#141414;border-radius:inherit`}),
                ]
            ),
            `${text}`
        ],
        {
            type:text.split(' ').join('')
        }
    )
}

sydDOM.clickableModelRes = (text = 'model',num,size) =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;min-height:30px;width:fit-content;padding:5px 7px;padding-top:20px;display:flex;column-gap:10px;justify-content:center;align-items:center;background:#2a2a2ab1;position:relative;border-radius:10px;text-transform:capitalize;cursor:pointer',
            onclick:`clickableMod('${text}','${num}',this)`
        },
        [
            createElement(
                'div',
                {
                    style:`min-height:18px;min-width:18px;background:#171717;border-radius:50%;display:flex;justify-content:center;align-items:center;`
                },
                [
                    createElement('div',{style:`min-height:10px;min-width:10px;background:${preState(['resolution','current'],'-1') === num ? 'green' : '#141414'};border-radius:inherit`}),
                ]
            ),
            `${text}`,
            createElement('p',{style:'position:absolute;top:5px;left:7px;font-size:10px;color:#fff'},[`${size}`])
        ]
    )
}

clickableMod = (text,num,elem) =>{
    // const downloadSite = getState('downloadSite');

    // elem
    const queryVDom = (query) =>{virtualDom[query.split(' ').join('')].children[0].children[0].style.background = '#141414'}

    const addGlow = (query) =>{virtualDom[query.split(' ').join('')].children[0].children[0].style.background = 'green'}

    switch(true)
    {
        case text === 'video':
            const downloadSiteOne = getState('downloadSite');
            downloadSiteOne.one = 'flex';
            useState('downloadSite',{type:'a',value:downloadSiteOne})
            queryVDom('audio');
            queryVDom('videoonly')
            addGlow(text);
            addGlow('video & audio');
            downloadObject.format = 'videoaudio';

            const resStateMain = getState('resolution');
            resStateMain.data = resStateMain.fetched.va;
            useState('resolution',{type:'a',value:resStateMain})
        break;
        case text === 'audio':
            virtualDom[text.split(' ').join('')].children[0].children[0].style.background = 'green'
            const downloadSite = getState('downloadSite');
            downloadSite.one = 'none';
            downloadSite.two = 'none';
            useState('downloadSite',{type:'a',value:downloadSite})
            queryVDom('video')
            addGlow(text)
            downloadObject.format = 'audio only'
        break;
        case text === 'video only':
            const downloadSiteThree = getState('downloadSite');
            downloadSiteThree.two = 'flex';
            useState('downloadSite',{type:'a',value:downloadSiteThree})
            queryVDom('video&audio');
            addGlow(text);
            downloadObject.format = 'video only';

            const resState1 = getState('resolution');
            resState1.data = resState1.fetched.v;
            resState1.sizes = resState1.fetched.vSize;
            resState1.current = '0'
            useState('resolution',{type:'a',value:resState1})
        break;
        case text === 'video & audio':
            const downloadSiteFour = getState('downloadSite');
            downloadSiteFour.two = 'flex';
            useState('downloadSite',{type:'a',value:downloadSiteFour})


            queryVDom('videoonly')
            addGlow(text);
            downloadObject.format = 'videoaudio';

            const resState2 = getState('resolution');
            resState2.data = resState2.fetched.va;
            resState2.sizes = resState2.fetched.vaSize;
            resState2.current = '0'
            useState('resolution',{type:'a',value:resState2})
        break;
        case /\d{1,}p\d{0,}/.test(text):
            const resolution = getState('resolution');
            resolution.current = num
            useState('resolution',{type:'a',value:resolution})
            downloadObject.resolution = text
        break;
        case num === 'otherDL':
            if(text.indexOf('video') !== -1)
            {
                // addGlow(preState(['othersDownload','mode'],'snapChat') + ' video')
                // queryVDom(preState(['othersDownload','mode'],'snapChat') + ' audio')
                downloadObject.format = 'video'

                downloadObject.url = downloadObject.videoUrl;

                elem.parentElement.children[0].children[0].children[0].style.background = 'green'
                elem.parentElement.children[1].children[0].children[0].style.background = '#141414'
            }else{
                elem.parentElement.children[0].children[0].children[0].style.background = '#141414'
                elem.parentElement.children[1].children[0].children[0].style.background = 'green'

                downloadObject.format = 'audio';
                downloadObject.url = downloadObject.audioUrl === undefined ? downloadObject.url : downloadObject.audioUrl
                console.log(downloadObject)
            }
        
    }
}

sydDOM.videoQualitySec = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;background:red;display:flex;row-gap:10px;max-width:800px;flex-direction:column;color:#171717;background:#fff;border-radius:20px;padding:20px;'+ styleComponent.shadow()
        },
        [
            createElement(
                'h1',
                {
                    style:'margin-bottom:20px;text-align:center'
                },
                [
                    'Download Videos in High-Quality MP4'
                ]
            ),
            createElement(
                'p',
                {
                    style:'font-weight:300;font-size:18px;padding:10px'
                },
                [
                    `Have you ever found yourself captivated by a video online, only to wish you could have it saved in the highest quality possible? Your search ends here. Introducing our cutting-edge solution: the ability to effortlessly download videos in pristine MP4 format, ensuring you never compromise on visual fidelity.`
                ]
            ),
            createElement(
                'p',
                {
                    style:'font-weight:300;font-size:18px;padding:10px'
                },
                [
                    `In today's digital age, where content reigns supreme, our tool empowers you to capture and retain the moments that matter most to you. Whether it's a tutorial you want to revisit, a memorable clip from your favorite show, or an inspiring speech that resonates deeply, downloading videos in high-quality MP4 ensures every pixel and detail is preserved with clarity.`
                ]
            ),
            createElement(
                'p',
                {
                    style:'font-weight:300;font-size:18px;padding:10px'
                },
                [
                    `Gone are the days of settling for grainy resolutions or unreliable downloads. With our user-friendly platform, you can transform any online video into a portable, sharable MP4 file in just a few clicks. Whether you're a professional seeking to archive important presentations or a casual viewer looking to build a personal collection, our service caters to your diverse needs with ease`
                ]
            ),
        ]
    )
}

sydDOM.qualitativeDetails = () =>{
    return createElement(
        'div',
        {
            style:'position:absolute;transform:translateY(100%);bottom:0;height:fit-content;width:100%;background:#fff;color:#171717;display:flex;flex-direction:column;row-gap:20px;align-items:center;padding:20px;'
        },[
            createElement(
                'h1',
                {
                    style:'margin-bottom:20px;text-align:center;max-width:800px'
                },
                [
                    'How to Download Videos Online from vidextract in MP4 Format with High Definition - illustration',
                ]
            ),
            sydDOM.wrapContainer({text:'Start with Copying the Video URL you want to download. Visit the download page and paste the URL into the specified input field. Then automatically, your download will start processing',img:'',num:'1'}),
            sydDOM.wrapContainer({direction:'row-reverse',text:'Your video should start processing, after which a list of options for your choice of download will pop-up in mp4 format, through will you can choose your download resolution for youtube and other social media downloads',img:'',num:'2'}),
            sydDOM.wrapContainer({direction:'row',text:'Click on the download button to start downloading your video, you can also choose to download an audio only version(mp3), by clicking on the audio option',img:'',num:'3'}),
            sydDOM.contactOption()
        ]
    )
}

sydDOM.wrapContainer = ({direction = 'row',text = '', img = '',num}) =>{
    return createElement(
        'div',
        {
            style:`width:100%;height:fit-content;max-width:800px;display:flex;column-gap:10px;flex-wrap:wrap;justify-content:center;background:lightgrey;align-items:center;padding:20px;flex-direction:${direction};row-gap:10px;border-radius:20px`,
            class:'wrapContainer'
        },
        [ 
            createElement(
                'p',
                {
                    style:'min-height:200px;height:fit-content;min-width:300px;background:unset;font-size:20px;text-align:left;padding:10px;padding-top:50px;background:#fff;border-radius:20px'
                },
                [
                    createElement('strong',{},[`${num} .`]),text
                ]
            ),
            createElement(
                'div',
                {
                    style:'min-height:200px;height:100%;min-width:300px;background:unset;' + styleComponent.bg({method:'add',style:{backgroundImage:`url("./assets/${num}.jpg")`,backgroundSize:'contain'}})
                }
            )
        ]
    )
}

sydDOM.contactOption = () =>{
    return createElement(
        'div',
        {
            style:'height:fit-content;width:100%;max-width:800px;display:flex;column-gap:20px;flex-wrap:wrap;align-items:center;margin-top:100px;margin-bottom:50px;row-gap:10px'
        },
        [
            createElement(
                'h1',
                {
                    style:'min-width:fit-content'
                },
                [
                    'Vidextract.com',
                ]
            ),
                    createElement(
                        'p',
                        {
                            style:'display:flex;column-gap:10px;flex-wrap:wrap;row-gap:5px'
                        },
                        [
                            createElement('strong',{style:'min-width:fit-content'},['contact us: ']),
                            createElement('a',{href:'tel:08102945561'},['+2348102945561']),
                            createElement('a',{href:'tel:09078762938'},['+2349078762938']),
                        ]
                    )
        ]
    )
}

mount(sydDOM.container())