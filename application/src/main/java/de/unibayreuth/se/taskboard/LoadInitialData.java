package de.unibayreuth.se.taskboard;

import de.unibayreuth.se.taskboard.business.domain.Task;
import de.unibayreuth.se.taskboard.business.domain.TaskStatus;
import de.unibayreuth.se.taskboard.business.domain.User;
import de.unibayreuth.se.taskboard.business.ports.TaskService;
import de.unibayreuth.se.taskboard.business.ports.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Load initial data into the list via the list service from the business layer.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("dev")
class LoadInitialData implements InitializingBean {
    private final TaskService taskService;
    private final UserService userService;

    @Override
    public void afterPropertiesSet() {
        log.info("Deleting existing data...");
        userService.clear();
        taskService.clear();

        log.info("Loading initial data...");

        // Create users
        List<User> users = TestFixtures.createUsers(userService);

        // Create tasks
        List<Task> tasks = List.of(
                new Task("Fix Login Issue", "Investigate and resolve login failures."),
                new Task("Database Cleanup", "Remove duplicate records."),
                new Task("Review PR #145", "Conduct a code review."),
                new Task("Optimize API Performance", "Improve authentication API speed."),
                new Task("Implement Dark Mode", "Add dark mode support to UI."),
                new Task("Write Unit Tests", "Add unit tests for payment processing."),
                new Task("Security Patch Deployment", "Deploy latest security updates."),
                new Task("Design Homepage Banner", "Create a new banner for promotions."),
                new Task("Customer Feedback Analysis", "Analyze customer feedback data."),
                new Task("Bug Fix: Notifications", "Resolve issue where notifications don't appear."),
                new Task("Automate Reports", "Create an automated reporting system.")
        );

        tasks.forEach(taskService::create);

        List<Task> createdTasks = taskService.getAll();

        if (createdTasks.size() >= 6) {
            createdTasks.get(0).setStatus(TaskStatus.valueOf("TODO")); // Unassigned
            createdTasks.get(1).setStatus(TaskStatus.valueOf("TODO"));
            createdTasks.get(1).setAssigneeId(users.getFirst().getId());

            createdTasks.get(2).setStatus(TaskStatus.valueOf("DOING"));
            createdTasks.get(3).setStatus(TaskStatus.valueOf("DOING"));
            createdTasks.get(3).setAssigneeId(users.get(1).getId());

            createdTasks.get(4).setStatus(TaskStatus.valueOf("DONE"));
            createdTasks.get(5).setStatus(TaskStatus.valueOf("DONE"));
            createdTasks.get(5).setAssigneeId(users.get(2).getId());
        }

        createdTasks.forEach(taskService::upsert);

        log.info("Loaded {} users and {} tasks.", users.size(), createdTasks.size());
    }
}