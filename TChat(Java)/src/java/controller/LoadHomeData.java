package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.User_Status;
import java.io.File;
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
@WebServlet(name = "LoadHomeData", urlPatterns = {"/LoadHomeData"})
public class LoadHomeData extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        responseJson.addProperty("message", "Unable to process your request");
        
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();

            //get user id from request parameters
            String userId = request.getParameter("id");

            //get user Object
            User user = (User) session.get(User.class, Integer.parseInt(userId));
            User user1 = (User) session.get(User.class, Integer.parseInt(userId));

            //get user status = 1 (online)
            User_Status user_Status = (User_Status) session.get(User_Status.class, 1);

            //update user status
            user.setUser_status(user_Status);
            session.update(user);

            //get other users
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.ne("id", user.getId()));
            
            //get user
            Criteria criteria2 = session.createCriteria(User.class);
            criteria2.add(Restrictions.eq("id", user1.getId()));
            
            List<User> otherUserList = criteria.list();
            User user2 = (User) criteria2.uniqueResult();

            //remove password
            JsonArray jsonChatArray = new JsonArray();
            for (User otherUser : otherUserList) {

                //get chats
                Criteria criteria1 = session.createCriteria(Chat.class);
                
                criteria1.add(
                        Restrictions.or(
                                Restrictions.and(
                                        Restrictions.eq("from_user", user),
                                        Restrictions.eq("to_user", otherUser)
                                ),
                                Restrictions.and(
                                        Restrictions.eq("from_user", otherUser),
                                        Restrictions.eq("to_user", user)
                                )
                        )
                );
                
                criteria1.addOrder(Order.desc("id"));
                criteria1.setMaxResults(1);

                //date format
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy, MMM dd hh:ss a");
                
                //create chat item to send frontend data
                JsonObject chatItem = new JsonObject();
                chatItem.addProperty("other_user_id", otherUser.getId());
                chatItem.addProperty("other_user_mobile", otherUser.getMobile());
                chatItem.addProperty("other_user_name", otherUser.getFirst_name() + " " + otherUser.getLast_name());
                chatItem.addProperty("other_user_status", otherUser.getUser_status().getId()); //1 = online, 2 = offline
                
                //user
                chatItem.addProperty("user_name", user1.getFirst_name() + " " + user1.getLast_name());
                chatItem.addProperty("user_mobile", user1.getMobile());
                chatItem.addProperty("user_id", user1.getId());
                chatItem.addProperty("user_registered_date", dateFormat.format(user1.getRegisted_date()));
                
                //check user avatar image
                String serverPath = request.getServletContext().getRealPath("");
                String userAvatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + user.getMobile() + ".png";
                File userAvatarImageFile = new File(userAvatarImagePath);
                
                if (userAvatarImageFile.exists()) {
                    //avatar image found
                    chatItem.addProperty("user_avatar_image_found", true);
                } else {
                    //avatar image not found
                    chatItem.addProperty("user_avatar_image_found", false);
                    chatItem.addProperty("user_avatar_letters", user.getFirst_name().charAt(0) + "" + user.getLast_name().charAt(0));
                }

                //check other user avatar image
                String otherUserAvatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + otherUser.getMobile() + ".png";
                File otherUserAvatarImageFile = new File(otherUserAvatarImagePath);
                
                if (otherUserAvatarImageFile.exists()) {
                    //avatar image found
                    chatItem.addProperty("avatar_image_found", true);
                } else {
                    //avatar image not found
                    chatItem.addProperty("avatar_image_found", false);
                    chatItem.addProperty("other_user_avatar_letters", otherUser.getFirst_name().charAt(0) + "" + otherUser.getLast_name().charAt(0));
                }
                
                List<Chat> chatList = criteria1.list();
                
                if (chatList.isEmpty()) {
                    //no chat
                    chatItem.addProperty("message", "Say HELLO to " + otherUser.getFirst_name()+ " !!!");
                    chatItem.addProperty("dateTime", dateFormat.format(user.getRegisted_date()));
                    chatItem.addProperty("chat_status_id", 1);//1 = seen, 2 = unseen

                } else {
                    //found last chat
                    chatItem.addProperty("message", chatList.get(0).getMessage());
                    chatItem.addProperty("dateTime", dateFormat.format(chatList.get(0).getDate_time()));
                    chatItem.addProperty("chat_status_id", chatList.get(0).getChat_status().getId()); //1 = seen, 2 = unseen
                    
                }
                
                //get last conversation
                jsonChatArray.add(chatItem);
                
            }

            //send users
            responseJson.addProperty("success", true);
            responseJson.addProperty("message", "Success");
            responseJson.add("jsonChatArray", gson.toJsonTree(jsonChatArray));
            responseJson.add("user2", gson.toJsonTree(user2));
            
            session.beginTransaction().commit();
            session.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }
    
}
