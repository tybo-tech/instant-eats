import { Item } from "src/models/item.model";

export class EmailHelper {
  public static getWelcomeEmailForDriver(username: string, companyName: string, link: string) {
    return `
        
            <div style="padding: 2em; max-width: 30em; text-align: center; background: #ecf0f1; margin: 1em; border-radius: .5em;">
            <h1 style="font-size: 1.2em;">
            Welcome to ${companyName}

            </h1>

            <p style="padding: 1em 0;">
            Hello ${username} <br><br>
            We're glad to welcome you. With ${companyName}, you can Earn extra money working flexible hours. Start delivering
            today.


            </p>


            <a style=" text-decoration: none;" href="${link}">
            <button
                style="width: 20rem;border: none; cursor: pointer; border-radius: .4em; margin: .5em auto; font-weight: 600; display: block; background: #000; color: #fff; padding: 1em; text-transform: uppercase;">
              Login
            </button>
            </a>

            </div>
        
        `;
  }
  public static getWelcomeEmailForCustomer(username: string, companyName: string, link: string, email: string) {
    return `
        
            <div style="padding: 2em; max-width: 30em; text-align: center; background: #ecf0f1; margin: 1em; border-radius: .5em;">
            <h1 style="font-size: 1.2em;">
            Welcome to ${companyName}

            </h1>

            <p style="padding: 1em 0;">
            Hello ${username} <br><br>
   

            Thank you for using our platform  ${companyName}
            Your journey with us is about to begin.
            <br><br>

            <b>Please</b> Login using your Email address: ${email} ,
            <br><br>
            
            
            
            </p>
            

            <a style=" text-decoration: none;" href="${link}">
            <button
                style="width: 20rem;border: none; cursor: pointer; border-radius: .4em; margin: .5em auto; font-weight: 600; display: block; background: #000; color: #fff; padding: 1em; text-transform: uppercase;">
              Login
                </button>
                </a>
                <br><br>

                Yours faithfully
                ${companyName}Team

            </div>
        
            
        `;
  }
  public static getResetPasswordCustomer(username: string, link: string, companyName: string) {
    const data = `
        <div>
        <h1>
        Hi  ${username}  Let's reset that password.
        </h1>
    
        <p>
          Don't worry. It happens to everyone. To reset your password, click the button below.
        </p>
        <a href="${link}">
          <button  
          style="background: #F3CF3D; color: #000; padding: 1em; width: fit-content;border: none;border-radius: .5em;">
          Choose new password</button>
        </a>
    
        <br><br>
    
        <p>
        <br><br>

        Yours faithfully<br>
        ${companyName} Team
        </p>
        </div>
        `;

    return data;
  }


  public static getEmailBasicTemplate(item: Item, companyName,userName) {
    const data = `
    <div style="max-width: 30rem; border: 1px solid rgb(223, 222, 222);margin: 1rem auto;">

    <img src="${item.ImageUrl}" style="width: 100%;" alt="">
    <br>
    <br>
    <div style="padding: 1rem;">
    <h2 style="text-align: left;">${item.ItemCode}</h2>

    <div style="white-space: pre-wrap;" >Hi ${userName} </div>
    <br>
    <div style="white-space: pre-wrap;" >${item.Description}</div>
    <br>

<a href="${item.ActionUrl}">
    <button
        style="background: #F3CF3D; color: #000; padding: 1em; width: fit-content;border: none;border-radius: .5em;">
      ${item.ActionName}
    </button>
</a>

<br><br>

<p>
    Yours faithfully<br>
    ${companyName} Team
</p>
</div>
  
</div>
      `;

    return data;
  }
}