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

addEventListener('resize', e =>{
    setMediaQuery750();
})
addEventListener('load', () =>{
    setMediaQuery750();
})

function setMediaQuery750()
{
    const navMenu = getState('navMenu');
    const mobileMenu = getState('mobileMenu');
    // const floatingText = getState('floatingText');
    // const floatingText2 = getState('floatingText2')

    switch(true)
    {
        case Number(window.innerWidth) <= 800:
            console.log('hello world')
            navMenu.d = 'none';
            mobileMenu.d = 'flex';
            // floatingText.h = '50%'
            // floatingText2.h = '50%'
        break;
        default:
            navMenu.d = 'flex'
            mobileMenu.d = 'none';
            // floatingText.h = '100%'
            // floatingText2.h = '100%'
    }

    useState('navMenu', {type:'a',value:navMenu})
    useState('mobileMenu',{type:'a',value:mobileMenu})
    // useState('floatingText', {type:'a',value:floatingText});
    // useState('floatingText2', {type:'a',value:floatingText2})
}