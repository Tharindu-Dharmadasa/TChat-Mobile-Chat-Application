package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Session;

/**
 *
 * @author tharimdu
 */
@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        //JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);
        String mobile = request.getParameter("mobile");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String password = request.getParameter("password");
        Part avatarImage = request.getPart("avatarImage");

        if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Mobile Number");
        } else if (!Validations.isMobileNumberValid(mobile)) {
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (firstName.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your First Name");
        } else if (lastName.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Last Name");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Password");
        } else if (!Validations.isPasswordValid(password)) {
            responseJson.addProperty("message", "Invalid Password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            User user = new User();
            user.setFirst_name(firstName);
            user.setLast_name(lastName);
            user.setMobile(mobile);
            user.setPassword(password);
            user.setRegisted_date(new Date());

            //get user status 2 = offline
            User_Status user_Status = (User_Status) session.get(User_Status.class, 2);
            user.setUser_status(user_Status);

            session.save(user);
            session.beginTransaction().commit();

            if (avatarImage != null) {
                //image selected
                String serverPath = request.getServletContext().getRealPath("");
                String avatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + mobile + ".png";
                File file = new File(avatarImagePath);
                Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);

            }

            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Registration Complete.");

            session.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
