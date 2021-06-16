export class SubstringHelper
{
    public static  CutString(telephone:string)
    {
        let complete="";
        if(telephone!=null && telephone.match(/[0-9]/))
        {
            complete = telephone.substring(0,3)+"-"+telephone.substring(3,6)+"-"+telephone.substring(6,10);
        }
        return complete;
    }
}