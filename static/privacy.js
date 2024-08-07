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

setStyle([
    {
        nameTag:'container',
        style:{
            // height:'fit-content',
            height:'100vh',
            // width:'100vw',
            color:'#fff',
            fontFamily:'ubuntu',
            backgroundColor:'rgba(0,0,0,.2)',
            display:'flex',
            flexDirection:'column',
            rowGap:'20px',
            alignItems:'center',
            // padding:'0 10px',
            paddingTop:'100px',
            paddingBottom:'0',
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
            style:styleComponent.container()
        },
        [
            sydDOM.navBar_2(),
            createElement('h1',{style:'text-transform:capitalize;font-weight:500;font-size:25px;text-align:center;width:100%;margin-left:0;text-decoration:underline'},['vidextract privacy-policy']),
            createElement(
                'ul',
                {
                    style:"overflow:scroll;width:95%;height:100%;padding:20px 30px;display:flex;flex-direction:column;row-gap:20px;background-color:#fff;color:#171717;border-radius:15px;"
                },
                [
                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Introduction'),
                            sydDOM.normal('Welcome to vidextract.com. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.')
                        ]
                    ),
                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Information We Collect'),
                            sydDOM.normal('We may collect information about you in a variety of ways. The information we may collect on the site includes:'),
                            createElement(
                                'ul',
                                {
                                    style:'padding:0 20px;display:flex;flex-direction:column;row-gap:5px;'
                                },
                                [
                                    sydDOM.bold('Personal Data'),
                                    createElement('li',{style:'margin-left:20px;font-size:14px'},[
                                        'Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.'
                                    ]),

                                    sydDOM.bold('derivative Data'),
                                    createElement('li',{style:'margin-left:20px;'},[
                                        'Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.'
                                    ]),

                                    sydDOM.bold('Mobile Device Data'),
                                    createElement('li',{style:'margin-left:20px;'},[
                                        'Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the site from a mobile device.'
                                    ]),
                                ]
                            )
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Use of Your Information'),
                            sydDOM.normal('Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:'),

                            createElement(
                                'ul',
                                {
                                    style:'padding:0 20px;display:flex;flex-direction:column;row-gap:5px;'
                                },
                                [
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Create and manage your account.(coming soon...)'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Provide and manage services you request.'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Improve our website and services.'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Communicate with you about updates and services.'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Prevent fraudulent transactions and monitor against theft.'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Resolve disputes and troubleshoot problems.'
                                    ]),
                                    createElement('li',{style:'margin:10px 0;margin-left:20px;font-size:14px'},[
                                        'Respond to product and customer service requests.'
                                    ]),
                                ]
                            ),
                        ]
                    ),


                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Disclosure of Your Information'),
                            sydDOM.normal('We may share information we have collected about you in certain situations. Your information may be disclosed as follows:'),
                            createElement(
                                'ul',
                                {
                                    style:'padding:0 20px;display:flex;flex-direction:column;row-gap:5px;'
                                },
                                [
                                    sydDOM.bold('By Law or to Protect Rights'),
                                    createElement('li',{style:'margin-left:20px;font-size:14px'},[
                                        'If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.'
                                    ]),

                                    sydDOM.bold('Third-Party Service Providers'),
                                    createElement('li',{style:'margin-left:20px;'},[
                                        'We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.'
                                    ]),

                                    sydDOM.bold('Business Transfers'),
                                    createElement('li',{style:'margin-left:20px;'},[
                                        'We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.'
                                    ]),
                                ]
                            )
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Tracking Technologies'),
                            sydDOM.normal('We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help customize the site and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology.')
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Third-Party Websites'),
                            sydDOM.normal('The site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.')
                        ]
                    ),
                    
                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Security of Your Information'),
                            sydDOM.normal('We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.')
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Policy for Children'),
                            sydDOM.normal('We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.')
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Changes to This Privacy Policy'),
                            sydDOM.normal('We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.')
                        ]
                    ),

                    createElement(
                        'li',
                        {
                            style:''
                        },
                        [
                            sydDOM.bold('Contact Us'),
                            sydDOM.normal('If you have questions or comments about this Privacy Policy, please contact us at:'),
                            createElement('a',{href:'tel:08102945561'},['+2348102945561']),
                            createElement('a',{href:'tel:09078762938'},['+2349078762938']),
                        ]
                    ),
                ]
            )
        ]
    )
}
sydDOM.bold = (text) =>{
    return createElement(
        'p',
        {
            style:'font-weight:700;text-transform:capitalize;color:#171717;margin:10px 0;text-decoration:underline'
        },
        [
            text
        ]
    )
}

sydDOM.normal = (text) =>{
    return createElement(
        'p',
        {
            style:'font-weight:300;font-size:14px;padding-left:20px;margin-top:5px'
        },
        [
            text
        ]
    )
}

mount(sydDOM.container())
