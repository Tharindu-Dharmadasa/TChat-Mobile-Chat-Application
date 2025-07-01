package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.Validations;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author tharimdu
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        JsonObject jsonRequest = gson.fromJson(request.getReader(), JsonObject.class);
        String mobile = jsonRequest.get("mobile").getAsString();
        String password = jsonRequest.get("password").getAsString();

        if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Mobile Number");
        } else if (!Validations.isMobileNumberValid(mobile)) {
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Password");
        } else if (!Validations.isPasswordValid(password)) {
            responseJson.addProperty("message", "Invalid Password");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            //search mobile and password
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("mobile", mobile));
            criteria.add(Restrictions.eq("password", password));

            if (!criteria.list().isEmpty()) {
                //user found
                User user = (User) criteria.uniqueResult();

                responseJson.add("user", gson.toJsonTree(user));
                responseJson.addProperty("message", "Sign In Success");
                responseJson.addProperty("success", true);
            } else {
                //user not found
                responseJson.addProperty("message", "Invalid credentials");
            }

            session.close();
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));

    }

}
