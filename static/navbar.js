import {
    createElement,
    mount,
    sydDOM,
    preState,
    useState,
    setStyle,
    styleComponent,
    getState,
    virtualDom
} from '../sydneyDom.js'

const url = 'https://www.vidextract.com'

setStyle([
    {
        nameTag:'navBar',
        style:{
            width:'100%',
            display:'flex',
            padding:'5px 4rem',
            paddingRight:'0',
            columnGap:'30px',
            position:'fixed',
            top:'0',
            zIndex:'999',
            background:"#fff",
            boxShadow:'0 2px 5px #171717'
        }
    },
    {
        nameTag:'menuBox',
        style:{
            minHeight:'30px',
            minWidth:'30px',
            maxHeight:'30px',
            maxWidth:'30px',
            justifyContent:'center',
            alignItems:'center',
            display:'flex',
            cursor:'pointer'
        }
    },
    {
        nameTag:'linkIconify',
        style:{
            height:'15px',
            width:'15px',
            minHeight:'15px',
            minWidth:'15px',
            marginLeft:'3px'
        }
    }
])

sydDOM.navBar_2 = () =>{
    return createElement(
        'div',
        {
            style:styleComponent.navBar({method:'add',style:{height:`${preState(['navBar','h'],64)}px`}}),
            tabindex:'0',
            onblur:'removeBelowNav()',
        },
        [
            sydDOM.createLogo(),
            sydDOM.navMenu(),
            sydDOM.belowNav(),
            sydDOM.sideNav(),
            sydDOM.mobileMenu()
        ],
        {
            createState:{
                stateName:'navBar',
                state:{h:64,d:'flex'}
            },
            type:'navBar'
        }
    )
}

sydDOM.createLogo = () =>{
    return createElement(
        'div',
        {
            style:`height:100%;width:${preState(['navBar','h'],64) === 64 ? 70 : 100}px;background-image:url("./assets/logo.jpg");`+styleComponent.bg()
        }
    )
}

sydDOM.navMenu = () =>{
    return createElement(
        'ul',
        {
            style:`list-style-type:none;height:100%;width:fit-content;padding:15px 10px;display:${preState(['navMenu','d'],'flex')};justify-content:center;align-items:center;column-gap:10px;`
        },
        [
            sydDOM.nonTogMenu({type:'all'}),
            sydDOM.nonTogMenu({type:'youtube'}),
            sydDOM.nonTogMenu({type:'facebook'}),
            sydDOM.nonTogMenu({type:'twitter'}),
            sydDOM.nonTogMenu({type:'instagram'}),
            sydDOM.nonTogMenu({type:'tiktok'}),
            sydDOM.nonTogMenu({type:'privacy-policy'}),
            // sydDOM.nonTogMenuSupport(),
            // sydDOM.nonTogMenuSocial()
        ],
        {
            createState:{
                stateName:'navMenu',
                state:{d:'flex'}
            },
            type:'navMenu'
        }
    )
}

sydDOM.nonTogMenu = ({type}) =>{
    return createElement(
        'a',
        {
            style:'height:100%;width:fit-content;padding:0 15px;display:flex;justify-content:center;align-items:center;min-height:30px;column-gap:3px;font-weight:500;text-transform:capitalize;font-size:14px;color:#171717;text-decoration:none;',
            class:'menuIcon',
            href:type === "privacy-policy" ? `${url}/privacy-policy` :`${url}/?mode=${type}`
        },
        [
            `${type}`
        ]
    )
}

sydDOM.nonTogMenuSupport = () =>{
    return createElement(
        'li',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']),
            class:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','class']),
            onclick:'togMenu1(this,"nonTogMenuSupport")',
        },
        [
            'support',
            createElement('div',{style:'height:15px;width:15px;transition:transform linear .5s'})
        ],
        {
            type:'nonTogMenuSupport'
        }
    )
}

sydDOM.nonTogMenuSocial = () =>{
    return createElement(
        'li',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']),
            class:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','class']),
            onclick:'togMenu1(this,"nonTogMenuSocial")',
        },
        [
            'social',
            createElement('div',{style:'height:15px;width:15px;transition:transform linear .5s'})
        ],
        {
            type:'nonTogMenuSocial'
        }
    )
}

sydDOM.belowNav = () =>{
    togMenu1 = (elem,type) =>{
        const belowNav = getState('belowNav');

        console.log('hey clicking')
        virtualDom['navBar'].focus()

        switch(true)
        {
            case belowNav.controller !== type:
                belowNav.d = 'flex';
                belowNav.controller = type;
                setTimeout(() => {
                    const belowNav = getState('belowNav');
                    belowNav.o = '1'
                    useState('belowNav',{type:'a',value:belowNav})
                }, 100);
                elem.children[0].style.transform = 'rotateZ(-180deg)';
                virtualDom[type === 'nonTogMenuSocial' ? 'nonTogMenuSupport' : 'nonTogMenuSocial'].children[0].style.transform = 'rotateZ(0deg)'
            break;
            case belowNav.d === 'flex':
                belowNav.d = 'none';
                belowNav.o = '0';
                belowNav.controller = ''
                elem.children[0].style.transform = 'rotateZ(0deg)'
        }
        useState('belowNav',{type:'a',value:belowNav});
    }

    removeBelowNav = () =>{
        const belowNav = getState('belowNav');
        const sideNav = getState('sideNav')
        switch(belowNav.controller.length > 0)
        {
            case true:
                belowNav.d = 'none';
                belowNav.o = '0';
                virtualDom[belowNav.controller].children[0].style.transform = 'rotateZ(0deg)';
                belowNav.controller = ''
        }
        sideNav.t = -100
        useState('sideNav',{type:'a',value:sideNav})
        useState('belowNav',{type:'a',value:belowNav});
    }
    return createElement(
        'div',
        {
            style:`min-height:100px;position:absolute;left:0;top:100%;width:100%;display:${preState(['belowNav','d'],'none')};opacity:${preState(['belowNav','o'],'0')};transform:translateY(${preState(['belowNav','o'],'0') === '0' ? '-50%' : '0'});transition:opacity linear .1s,transform linear .2s;`,
        },
        [],
        {
            createState:{
                stateName:'belowNav',
                state:{d:'none',o:'0',controller:''}
            },
            type:'belowNav'
        }
    )
}

sydDOM.mobileMenu = () =>{
    togSideNav = () =>{
        const sideNav = getState('sideNav')
        switch(sideNav.t){
            case -100:
                sideNav.t = 0
                break;
            default:
                sideNav.t = -100
        }
        useState('sideNav',{type:'a',value:sideNav})
    }
    return createElement(
        'div',
        {
            style:styleComponent.menuBox([
                {method:'add',style:{
                    position:'absolute',
                    top:'50%',
                    transform:'translateY(-50%)',
                    left:'10px',
                    display:preState(['mobileMenu','d'],'none'),
                    backgroundImage:'url("./assets/men.png")'
                }}
            ]) + styleComponent.bg(),
            onclick:'togSideNav()'
        },
        [

        ],
        {
            createState:{
                stateName:'mobileMenu',
                state:{d:'none'}
            },
            type:'mobileMenu'
        }
    )
}

sydDOM.sideNav = () =>{
    return createElement(
        'div',
        {
            style:`height:calc(100vh - ${preState(['navBar','h'],64)}px);width:250px;max-width:100%;position:absolute;top:100%;left:-10px;transform:translateX(${preState(['sideNav','t'],-100)}%);transition:transform linear .3s;background:#fff`,
            // onclick:"focus_parent()"
        },
        [
            createElement(
                'ul',
                {
                    style:'display:flex;flex-direction:column;padding:10px;height:100%;width:100%;row-gap:20px;overflow-y:scroll;padding-bottom:120px;color:#000'
                },
                [
                    sydDOM.nonTogMobileMenuList({content:'all'}),
                    sydDOM.nonTogMobileMenuList({content:'youtube'}),
                    sydDOM.nonTogMobileMenuList({content:'facebook'}),
                    sydDOM.nonTogMobileMenuList({content:'twitter'}),
                    sydDOM.nonTogMobileMenuList({content:'instagram'}),
                    sydDOM.nonTogMobileMenuList({content:'tiktok'}),
                    sydDOM.nonTogMobileMenuList({content:'privacy-policy'}),
                    // sydDOM.togMobileMenuListSupport(),
                    // sydDOM.togMobileMenuListSocial()
                ]
            )
        ],
        {
            createState:{
                stateName:'sideNav',
                state:{t:-100}
            },
            type:'sideNav'
        }
    )
}

sydDOM.nonTogMobileMenuList = ({content}) =>{
    focus_parent = (content) =>{
        location.href = content === "privacy-policy" ? `${url}/privacy-policy` : `${url}/?mode=${content}`
    }
    return createElement(
        'li',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']) + ';height:fit-content;padding-bottom:10px;padding-top:10px;cursor:pointer;color:#171717;text-decoration:underline',
            // href:,
            onclick:`focus_parent('${content}')`
        },
        [
            `${content}`
        ]
    )
}

sydDOM.nonTogMobileMenuListIconify = ({content}) =>{
    return createElement(
        'li',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']) + 'height:fit-content;cursor:pointer'
        },
        [
            `${content}`,
            createElement(
                'div',
                {
                    style:styleComponent.linkIconify()
                }
            )
        ]
    )
}

sydDOM.togMobileMenuListSupport = () =>{
    return createElement(
        'div',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']) + 'min-height:fit-content;height:fit-content;flex-direction:column;align-items:flex-start;row-gap:20px;'
        },
        [
            'support',
            createElement(
                'div',
                {style:'row-gap:20px;display:inherit;flex-direction:inherit'},
                [
                    sydDOM.nonTogMobileMenuList({content:'tutorials'}),
                    sydDOM.nonTogMobileMenuListIconify({content:'support'})
                ]
            )
        ]
    )
}

sydDOM.togMobileMenuListSocial = () =>{
    return createElement(
        'div',
        {
            style:sydDOM.nonTogMenu({type:'null'}).inherit(['attribute','style']) + 'min-height:fit-content;height:fit-content;flex-direction:column;align-items:flex-start;row-gap:20px;'
        },
        [
            'social',
            createElement(
                'div',
                {style:'row-gap:20px;display:inherit;flex-direction:inherit'},
                [
                    sydDOM.nonTogMobileMenuListIconify({content:'facebook'}),
                    sydDOM.nonTogMobileMenuListIconify({content:'instagram'}),
                    sydDOM.nonTogMobileMenuListIconify({content:'tik-tok'}),
                    sydDOM.nonTogMobileMenuListIconify({content:'yotube'}),
                    sydDOM.nonTogMobileMenuListIconify({content:'x'})

                ]
            )
        ]
    )
}
