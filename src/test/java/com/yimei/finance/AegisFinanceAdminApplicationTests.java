package com.yimei.finance;

import com.yimei.finance.entity.tpl.User;
import com.yimei.finance.repository.tpl.JpaRepositoryDemo;
import com.yimei.finance.service.tpl.JpaRollbackDemo;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AegisFinanceAdminApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Autowired
	private JpaRepositoryDemo userRepository;

    @Autowired
    private JpaRollbackDemo jpaRollbackDemo;


    @Test
    public void testRollback() {
        userRepository.deleteAll();
        User rollback = new User("rollback",111l);
        User unrollback = new User("norollback",222l);
        try {
            jpaRollbackDemo.savePersonWithRollBack(rollback);
        } catch (Exception e) {
            System.out.println("do nothing");
        }

        Assert.assertEquals(null,userRepository.findByName("rollback"));

        try {
            jpaRollbackDemo.savePersonWithoutRollBack(unrollback);
        } catch (Exception e) {
            System.out.println("do nothing");
        }



        Assert.assertEquals("norollback",userRepository.findByName("norollback").getName());


    }


	@Test
	public void testJpa() throws Exception {

        userRepository.deleteAll();
		// 创建10条记录
		userRepository.save(new User("AAA", 10l));
		userRepository.save(new User("BBB", 20l));
		userRepository.save(new User("CCC", 30l));
		userRepository.save(new User("DDD", 40l));
		userRepository.save(new User("EEE", 50l));
		userRepository.save(new User("FFF", 60l));
		userRepository.save(new User("GGG", 70l));
		userRepository.save(new User("HHH", 80l));
		userRepository.save(new User("III", 90l));
		userRepository.save(new User("JJJ", 100l));

		// 测试findAll, 查询所有记录
		Assert.assertEquals(10, userRepository.findAll().size());

		// 测试findByName, 查询姓名为FFF的User
		Assert.assertEquals(60, userRepository.findByName("FFF").getAge().longValue());

		// 测试findUser, 查询姓名为FFF的User
		Assert.assertEquals(60, userRepository.findUser("FFF").getAge().longValue());

		// 测试findByNameAndAge, 查询姓名为FFF并且年龄为60的User
		Assert.assertEquals("FFF", userRepository.findByNameAndAge("FFF", 60l).getName());

		// 测试删除姓名为AAA的User
		userRepository.delete(userRepository.findByName("AAA"));

		// 测试findAll, 查询所有记录, 验证上面的删除是否成功
		Assert.assertEquals(9, userRepository.findAll().size());

	}

}
