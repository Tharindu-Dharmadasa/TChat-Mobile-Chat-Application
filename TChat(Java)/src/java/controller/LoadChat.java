package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author tharimdu
 */
@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Session session = HibernateUtil.getSessionFactory().openSession();

        Gson gson = new Gson();
        //get chat array
        JsonArray chatArray = new JsonArray();

        String logged_user_id = request.getParameter("logged_user_id");
        String other_user_id = request.getParameter("other_user_id");

        //get user
        User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));

        //get other user
        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

        //get chat
        Criteria criteria = session.createCriteria(Chat.class);
        criteria.add(
                Restrictions.or(
                        Restrictions.and(
                                Restrictions.eq("from_user", logged_user), Restrictions.eq("to_user", other_user)),
                        Restrictions.and(
                                Restrictions.eq("from_user", other_user), Restrictions.eq("to_user", logged_user))
                ));

        //sort chats
        criteria.addOrder(Order.asc("date_time"));

        //get chat_status = 1 (seen)
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 1);

        List<Chat> chat_list = criteria.list();

        //date format
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MMM dd hh:ss a");

        for (Chat chat : chat_list) {

            //create chat object
            JsonObject chat_object = new JsonObject();
            chat_object.addProperty("message", chat.getMessage());
            chat_object.addProperty("datetime", dateFormat.format(chat.getDate_time()));

            //get chats from other user
            if (chat.getFrom_user().getId() == other_user.getId()) {
                
                chat_object.addProperty("side", "left");

                //get only unseen chats (unseen == 2)
                if (chat.getChat_status().getId() == 2) {

                    //update chat status -> seen
                    chat.setChat_status(chat_Status);
                    session.update(chat);

                }
            }else{
                //get chat from logged user
                chat_object.addProperty("side", "right");
                chat_object.addProperty("status", chat.getChat_status().getId());
            }

            //add chat object to array
            chatArray.add(chat_object);
        }
        
        session.beginTransaction().commit();
        
        //send resp
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(chatArray));
    }

}
