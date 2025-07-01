package model;

public class Validations {
    
    public static boolean isPasswordValid(String password){
        return password.matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$");
    }
    
    public static boolean isMobileNumberValid(String text){
        return text.matches("^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$");
    }
    
}
